import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {pushState} from 'redux-router';
import {close} from 'redux/modules/slidePage';
import {connect} from 'react-redux';
import {setLayoutName, setName} from 'redux/modules/layout';
import {toggle as toggleGlass} from 'redux/modules/glass';
import { API as leadsAPI } from 'redux/modules/data';

@connect(state => (
  {name: state.layout.name, address: state.layout.address, leads: state.data.leads, leadsCount: state.data.leadsCount, logged: state.layout.userLogged, filter: state.layout.filter, refreshNeeded: state.data.refreshNeeded}),
  {close, pushState, setLayoutName, setName, loadLeads: leadsAPI.load, loadLeadByID: leadsAPI.loadOne, toggleGlass})
export default class ExistingLeads extends Component {
  static propTypes = {}

  state = {
    filter: '',
    selectedIndex: -1,
    minPage: 1,
    maxPage: parseInt(this.props.leadsCount / 100, 10) + 1, // remove decimal
    dateBoxOpened: false,
    dateSelected: 'Created',

    // fields below are used for SQL generation
    activePage: 1,
    order: 'created_at',
    ascending: false,
    type: 'all'
  };

  componentWillMount() {
    // Load Data from Database
    this.props.loadLeads();

    this.props.setLayoutName('Open an Existing Lead');
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.order !== nextState.order || this.state.ascending !== nextState.ascending || this.state.activePage !== nextState.activePage) {
      this.props.loadLeads(nextState.activePage, nextState.order, nextState.ascending, this.props.filter);
    } else if (this.props.filter !== nextProps.filter) {
      this.props.loadLeads(this.state.activePage, this.state.order, this.state.ascending, nextProps.filter);
    } else if (nextProps.refreshNeeded === true) {
      // when leads are updated from somewhere else, we need to propagate changes
      this.props.loadLeads(this.state.activePage, this.state.order, this.state.ascending, nextProps.filter);
    }

    if (this.state.dateBoxOpened !== nextState.dateBoxOpened) {
      if (nextState.dateBoxOpened) {
        document.addEventListener('click', this.handleClick, false);
      } else {
        document.removeEventListener('click', this.handleClick, false);
      }
    }

    return true;
  }

  setActive = (index) => {
    this.setState({selectedIndex: index});
  }

  setOrder = (val) => {
    if (this.state.order === val) {
      this.setState({ascending: !this.state.ascending});
    } else {
      this.setState({order: val, ascending: true});
    }
  }

  setActivePage = (num) => {
    if (num >= this.state.minPage && num <= this.state.maxPage) {
      this.setState({activePage: num});
      // this.props.loadLeads(num, this.state.order, this.state.ascending);
    }
  }

  handleClick = (event) => {
    if (!this.state.dateBoxOpened) {
      console.log('not opened');
      return;
    }

    if (ReactDOM.findDOMNode(this.refs.dateBox).contains(event.target)) {
      console.log('inside');
      return;
    }

    this.toggleDateBox();
    event.stopPropagation();
    event.preventDefault();
    event.nativeEvent.stopImmediatePropagation();
  }

  selectDate = (str) => {
    this.setState({
      dateSelected: str,
      order: str === 'Created' ? 'created_at' : 'updated_at',
      dateBoxOpened: false
    });
  }

  toggleDateBox = () => {
    this.setState({dateBoxOpened: !this.state.dateBoxOpened});
  }

  goNext = () => {
    this.setActivePage(this.state.activePage + 1);
  }

  goBack = () => {
    const page = this.state.activePage - 1;
    this.setActivePage(page);
  }

  filterNames = () => {
    this.setState({filter: this.refs.filter.value});
  }

  showMap = () => {
    this.props.close();
    this.props.pushState(null, '/center-map');
  }

  selectLead = (event) => {
    const row = event.currentTarget;
    const id = row.dataset.id;
    const name = row.childNodes[1].innerText;
    window.selectedName = name;
    window.selectedId = id;

    this.props.loadLeadByID(id);

    this.props.toggleGlass('ExistingLeadGlass');
  }

  printColumnHeader = (columnName, actionOnClick) => {
    const cols = {
      'Created': 'created_at',
      'System Address': 'street',
      'Name': 'lastname',
      'Modified': 'updated_at'
    };

    if (!cols[columnName]) {
      console.error('Column Name not found in Columns.', cols, columnName);
    }

    let result;
    if (this.state.order === cols[columnName]) {
      const arrow = this.state.ascending ? <span className="arrow">&#9650;</span> : <span className="arrow">&#9660;</span>;

      result = <strong onClick={actionOnClick}>{columnName} {arrow}</strong>;
    } else {
      result = <span onClick={actionOnClick}>{columnName}</span>;
    }
    return result;
  }

  render() {
    require('./ExistingLeads.scss');

    const {filter} = this.state;
    const printDate = (value) => {
      const date = global.moment(value);
      return date.format('MM/DD/YY');
    };

    // @names array
    const printName = (names) => {
      const name = names.join(' ');
      return name;
    };

    const flag = <span className="flagged"></span>;

    const leads = this.props.leads.map((lead) => {
      const row = [lead.firstname, lead.lastname, lead.street, lead.city].join(' ');
      if (row.toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
        return (
          <div key={lead.id} data-id={lead.id} className="row person" onClick={this.selectLead}>
            <div className="cell flag">
              {lead.flagged && flag}
            </div>
            <div className="cell name">
              {printName([lead.firstname, lead.middlename, lead.lastname])}
            </div>

            <div className="cell address">
              {lead.street} {lead.city}
            </div>

            <div className="cell date">
              {printDate(this.state.dateSelected === 'Created' ? lead.created_at : lead.updated_at)}
            </div>

            <div className="cell type capitalize">
              {lead.type}
            </div>
          </div>
        );
      }
    });

    const pagination = (
      <ul className="pagination">
        <li onClick={this.setActivePage.bind(this, this.state.minPage)}>{this.state.minPage}</li>
        <li onClick={this.goBack}>&lt;</li>
        <li className="active">{this.state.activePage}</li>
        <li onClick={this.goNext}>&gt;</li>
        <li onClick={this.setActivePage.bind(this, this.state.maxPage)}>{this.state.maxPage}</li>
      </ul>
    );

    return (
      <div ref="component" className="section" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
      }}>
        <div id="search-bar" className="input-row " style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          marginTop: 0,
          paddingBottom: 0,
        }}>
          <input ref="filter" onKeyUp={this.filterNames} className="input-field sticky-search" placeholder="Search Filter" type="text" style={{flexGrow: 5, marginRight: 5, zIndex: 1500}}/>
        </div>

        <div className="table">
          <div className="row shadows">
            <div className="cell flag"></div>
            <div className="cell name" style={{transform: 'translateZ(0)', zIndex: 150, overflow: 'visible'}}>
              <img src="/images/columnDividers.svg" style={{position: 'fixed', width: 40, height: 4285, right: -15}}/>
            </div>
            <div className="cell address" style={{transform: 'translateZ(0)', zIndex: 150, overflow: 'visible'}}>
              <img src="/images/columnDividers.svg" style={{position: 'fixed', width: 40, height: 4285, right: -15}}/>
            </div>
            <div className="cell date" style={{transform: 'translateZ(0)', zIndex: 150, overflow: 'visible'}}>
              <img src="/images/columnDividers.svg" style={{position: 'fixed', width: 40, height: 4285, right: -15}}/>
            </div>
            <div className="cell type" style={{transform: 'translateZ(0)', zIndex: 150, overflow: 'visible'}}>
              <img src="/images/columnDividers.svg" style={{position: 'fixed', width: 40, height: 4285, right: -40}}/>
            </div>

          </div>

          <div className="row header">
            <div className="cell flag"></div>
            <div className="cell name">{this.printColumnHeader('Name', this.setOrder.bind(this, 'lastname'))}</div>
            <div className="cell address">{this.printColumnHeader('System Address', this.setOrder.bind(this, 'street'))}</div>
            <div className="cell date" style={{overflow: 'visible'}}>
              <img className="date-box-toggle" src="/images/icon_dateSort.svg" width="30" onClick={this.toggleDateBox}/>
              <div className="date-box " ref="dateBox" style={{
                display: this.state.dateBoxOpened ? 'block' : 'none'
              }}>
                <ul>
                  <li onClick={this.selectDate.bind(this, 'Created')}>Created</li>
                  <li onClick={this.selectDate.bind(this, 'Modified')}>Modified</li>
                </ul>
              </div>
              {this.printColumnHeader(this.state.dateSelected, this.setOrder.bind(this, this.state.dateSelected === 'Created' ? 'created_at' : 'updated_at'))}
            </div>
            <div className="cell type">Type</div>
          </div>
          {leads}
        </div>

        {this.props.leadsCount > 100 && pagination}
       </div>
    );
  }
}
