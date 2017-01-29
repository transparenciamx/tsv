import moment from 'moment';
import React from 'react';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: null,
      value: null,
      limit: 30
    }
  }

  componentDidMount() {
    this.ui = {}
    this.ui.form = $('form#queryForm');
    this.ui.bullets = this.ui.form.find('div.bullets span');
    this.ui.input = this.ui.form.find( 'input#query' );

    // Setup calendar
    this.ui.form.find("span[data-filter='date']").datepicker({
      clearBtn: true,
      assumeNearbyYear: true,
      format: 'mm/dd/yyyy',
      language: 'es',
      maxViewMode: 2,
      multidate: 2,
      todayHighlight: true
    }).on( 'hide', (function( e ) {
      e.dates.sort(function(a, b) {
        return new Date(a).getTime() - new Date(b).getTime();
      });
      let lbl = moment(e.dates[0]).format('MMMM Do YYYY');
      let val = moment(e.dates[0]).format('MM-DD-YYYY');
      if( e.dates.length > 1 ) {
        lbl += ' a ' + moment(e.dates[1]).format('MMMM Do YYYY')
        val += '|' + moment(e.dates[1]).format('MM-DD-YYYY');
      }

      // Update state
      this.setState({
        value: val
      });

      // Update UI
      this.ui.input.val( lbl );
      this.ui.input.focus();
    }).bind(this));

    // Setup slider
    this.ui.form.find("span[data-filter='amount']").popover({
      html: true,
      title: 'Seleccione el rango a utilizar como filtro (MXN)',
      content: '<b>$0</b><input id="amountSlider" type="text" /><b>$100,000,000</b>',
      placement: 'bottom',
      trigger: 'focus'
    }).on( 'shown.bs.popover', (function() {
      $("#amountSlider").slider({
        step: 50000,
        min: 0,
        max: 100000000,
        value: [20000000,80000000],
        formatter: function( value ) {
          if( Array.isArray( value ) ) {
            var lbl = '$' + value[0].toLocaleString() + ' a ' + '$' + value[1].toLocaleString();
            return lbl;
          }
          return '';
        }
      }).on( 'slide', (function( e ) {
        this.setState({
          value: e.value.join('|')
        });
        this.ui.input.val( '$' + e.value[0].toLocaleString() + ' a ' + '$' + e.value[1].toLocaleString() );
      }).bind(this));
    }).bind(this));

    // Update state when filter value changes
    this.ui.input.on( 'keyup', (function() {
      this.setState({
        value: this.ui.input.val()
      })
    }).bind(this));

    // Handle filter selection
    this.ui.bullets.on( 'click', (function( e ) {
      // Toggle active
      let target = $( e.target );
      this.ui.bullets.removeClass( 'active' );
      target.addClass( 'active' );

      // Update state
      this.setState({
        filter: target.data('filter')
      });

      switch (target.data( 'filter' )) {
        case 'date':
          target.datepicker( 'show' );
          break;
        case 'amount':
          target.popover( 'toggle' );
          break;
      }
    }).bind(this) );

    // Handle form submit
    this.ui.form.on( 'submit', (function( e ) {
      e.preventDefault();
      this.props.onSubmit(this.state);
    }).bind(this));
  }

  render() {
    return (
      <div className="inner-row">
        <div className="row">
          <div className="col-md-12">
            <h2>Buscador de Contratos</h2>
            <p>Encuentra contratos o procedimientos de contratación registrados en Testigo Social 2.0 haciendo uso de los distintos filtros de búsqueda disponibles.</p>
            <form id="queryForm">
              <div className="input-group">
                <input type="text" className="form-control" id="query" name="query" placeholder="Buscar..." />
                <span className="input-group-btn">
                  <button className="btn btn-primary" type="submit">Buscar</button>
                </span>
              </div>
              <div className="bullets">
                <span className="btn-black active" data-filter="date">Fecha</span>
                <span className="btn-black" data-filter="amount">Monto</span>
                <span className="btn-black" data-filter="buyer">Comprador</span>
                <span className="btn-black" data-filter="provider">Proveedor</span>
                <span className="btn-black" data-filter="procedureType">Tipo de Procedimiento</span>
                <span className="btn-black" data-filter="procedureNumber">No. de Procedimiento</span>
                <span className="btn-black" data-filter="contractNumber">No. de Contrato</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchBar;