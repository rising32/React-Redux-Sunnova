import React, {Component, PropTypes} from 'react';

import request from 'superagent';
import shortid from 'shortid';

import {connect} from 'react-redux';
import {toggle} from 'redux/modules/glass';
import {pushState} from 'redux-router';
import {toggle as toggleSlidePage, openTop} from 'redux/modules/slidePage';
import {setName, setAddress} from 'redux/modules/layout';
import {setLayoutName} from 'redux/modules/layout';

import {API as leadsAPI} from 'redux/modules/data';
import {setOrigin} from 'redux/modules/navigation';


function capitalize(str) {
  if (!str || typeof(str) !== 'string') {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}


@connect((state) => ({lead: state.data.selectedLead, origin: state.navigation.origin}), {
  toggle,
  toggleSlidePage,
  pushState,
  setName,
  setAddress,
  setLayoutName,
  saveLead: leadsAPI.save,
  updateLead: leadsAPI.update,
  setOrigin,
  openTop
})
export default class NewLead extends Component {
  static propTypes = {}

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    additionalContacts: {},
    showBillingAdress: false,
    testData: false,
    createMode: !!!(this.props.lead && this.props.lead.id),
    populatedAddress: {
      street: null,
      city: null,
      postalcode: null,
      state: null
    },
    origin: ''
  };

  componentWillMount() {
    this.setState({origin: this.props.origin});
    this.props.setOrigin();
    this.props.setLayoutName('Contact Details');
  }

  componentDidMount() {
    console.log(this.state);
    if (!this.state.createMode) {
      console.debug('NewLead: update mode');
      this.fill(this.props.lead);
    } else {
      console.debug('NewLead: create mode');
    }

    // Set Formatter to format the Phone number automatically
    const phoneInput = this.refs.phone;
    if (phoneInput) {
      new Formatter(phoneInput, {'pattern': '{{999}}-{{999}}-{{9999}}'}); // eslint-disable-line
    }
  }

  onSubmitClick = () => {
    const validElements = document.querySelectorAll('.input-field.green-border');
    const inputsRequired = document.querySelectorAll('.input-field.required');
    if (validElements.length === inputsRequired.length) {
      // const middle = this.refs.middleName.value
      //   ? ' ' + this.refs.middleName.value + ' '
      //   : ' ';
      // const name = this.refs.firstName.value + middle + this.refs.lastName.value;

      this.save();
      if (this.state.origin === 'topSlidePage') {
        this.props.pushState(null, '/');
        this.props.toggleSlidePage();
        setTimeout(() => { this.props.openTop(); }, 0);
      } else if (!this.state.createMode) {
        this.props.toggleSlidePage();
        this.props.pushState(null, '/');
      } else {
        this.props.toggle('NewLeadGlass');
      }
      this.props.setOrigin();
    } else {
      for (const el of inputsRequired) {
        if (!el.classList.contains('green-border')) {
          el.classList.add('red-border');
        }
      }
    }

    this.refs.submit.classList.add('red-border');
  }

  onCancel = () => {
    // this.props.toggleSlidePage();
    this.props.pushState(null, '/menu');
  }

  getAddressFromGPS = () => {
    console.debug('[gps] getting address ...');
    // https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452

    const makeGreen = (arr) => {
      const greenClass = 'green-border';
      for (let index = 0; index < arr.length; index++) {
        const el = arr[index];
        el.classList.add(greenClass);
      }
    };

    const getAddress = (lat, lng) => {
      const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng;

      console.debug('[gps] requesting google maps api, to get address from GPS');
      request.get(url).set('Accept', 'application/json').end((err, res) => {
        if (err) {
          console.error(err);
          return;
        }
        console.debug('[gps] response received');
        const json = JSON.parse(res.text);
        console.log(json.results);

        if (json.results.length < 1) {
          console.error('[gps] address not found');
          return;
        }
        console.debug('[gps] ', json.results[0].formatted_address);

        const addr = json.results[0].address_components;

        const validFields = [this.refs.street, this.refs.city, this.refs.zip];
        let state = addr[5].short_name;
        if (state.length !== 2) {
          state = null;
        } else {
          validFields.push(this.refs.state);
        }

        this.refs.street.value = addr[1].long_name + ' ' + addr[0].short_name;
        this.refs.city.value = addr[3].long_name;
        this.refs.state.value = state;
        this.refs.zip.value = parseInt(addr[7].short_name.split(' ').join(''), 10) || null;

        makeGreen(validFields);
        this.makeValidateGreen();
        this.makeSubmitGreen();
      });
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition((location) => {
      console.debug('[gps] lat: ', location.coords.latitude);
      console.debug('[gps] lng: ', location.coords.longitude);
      console.debug('[gps] accuracy: ', location.coords.accuracy);

      getAddress(location.coords.latitude, location.coords.longitude);
    },
    (err) => {
      console.warn(err);
    }, options);
  }

  billingAddressTrue = () => {
    this.setState({showBillingAdress: true});
  }

  billingAddressFalse = () => {
    this.setState({showBillingAdress: false});
  }

  actionPartial = () => {
    //TODO: claim to yourself
    this.save('partial');

    // this.props.toggleSlidePage();
    this.props.pushState(null, '/menu');
  }

  addAnotherContact = () => {
    const obj = {};
    const newTempId = shortid.generate();
    obj[newTempId] = {
      firstname: shortid.generate(),
      middlename: shortid.generate(),
      lastname: shortid.generate(),
      phone: shortid.generate(),
      email: shortid.generate()
    };

    this.setState({
      additionalContacts: {
        ...this.state.additionalContacts,
        ...obj
      }
    });
  }

  fill = (obj) => {
    const formFields = [
      'firstName',
      'middleName',
      'lastName',
      'email',
      'phone',
      'street',
      'city',
      'state',
      'zip'
    ];
    const objFields = [
      'firstname',
      'middlename',
      'lastname',
      'email',
      'phone',
      'street',
      'city',
      'state',
      'postalcode'
    ];

    for (let index = 0; index < formFields.length; index++) {
      const property = formFields[index];
      const objProperty = objFields[index];

      if (!obj || !obj.hasOwnProperty(objProperty)) {
        console.error('Lead object not valid. Property ' + objProperty + ' not found in:', obj);
        return;
      }

      const fieldValue = obj[objProperty];
      if (fieldValue !== null && fieldValue !== '') {
        // fill input
        const field = this.refs[property];
        if (property === 'phone') {
          field.value = this.printPhone(fieldValue);
        } else {
          field.value = fieldValue;
        }
        field.className += ' green-border';
      }
      this.makeValidateGreen();
      this.makeSubmitGreen();
    }
  }

  printPhone = (phone) => {
    if (!phone) {
      return '';
    }
    console.log(phone, phone.substr(0, 3), phone.substr(3, 3), phone.substr(6, 4));
    return phone.substr(0, 3) + '-' + phone.substr(3, 3) + '-' + phone.substr(6, 4);
  };

  save = (type = 'existing') => {
    const obj = {};
    obj.firstname = capitalize(this.refs.firstName.value);
    obj.middlename = capitalize(this.refs.middleName.value);
    obj.lastname = capitalize(this.refs.lastName.value);
    obj.email = this.refs.email.value;

    obj.phone = null;
    if (this.refs.phone.value) {
      obj.phone = this.refs.phone.value.split('-').join(''); // Get rid of the dash character in the phone number
    }

    obj.type = type;
    obj.testing = !!this.state.testData;

    obj.street = this.refs.street.value;
    obj.city = capitalize(this.refs.city.value);
    obj.state = this.refs.state.value;
    obj.postalcode = this.refs.zip.value;
    obj.country = 'USA';

    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) {
        continue;
      }
      const value = obj[key];
      if (value && typeof value === 'string') {
        obj[key] = value.trim();
      }
    }

    const getValues = (contactId) => {
      const contactRefs = this.state.additionalContacts[contactId];
      if (!contactId) {
        console.error('Contact ID does not exists', contactId);
        return {};
      }

      const res = {};
      for (const key in contactRefs) {
        if (!contactRefs.hasOwnProperty(key)) {
          continue;
        }

        const fieldId = contactRefs[key];
        res[key] = this.refs[fieldId].value;
      }
      return res;
    };

    const contactValues = [];
    const contacts = this.state.additionalContacts;
    for (const key in contacts) {
      if (!contacts.hasOwnProperty(key)) {
        continue;
      }

      const person = getValues(key);
      contactValues.push(person);
    }

    // set additional contacts
    obj.contacts = contactValues;

    console.log('save ', obj);
    if (this.state.createMode) {
      this.props.saveLead(obj);
    } else {
      this.props.updateLead(this.props.lead.id, obj);
    }
  }

  updateName = () => {
    console.log('onchange called');

    const middle = this.refs.middleName.value
      ? ' ' + this.refs.middleName.value + ' '
      : ' ';
    const name = capitalize(this.refs.firstName.value) + capitalize(middle) + capitalize(this.refs.lastName.value);
    console.log(name);
    if (name.length > 1) {
      this.props.setName(name.trim());
    } else {
      this.props.setName('Home Owner');
    }
  }

  updateAddress = () => {
    const address = capitalize(this.refs.street.value) + ' ' + capitalize(this.refs.city.value);
    if (address.length > 1) {
      this.props.setName(address.trim());
    } else {
      this.props.setName('Curry Residence at 21857 Brennan Rd.');
    }
  }

  makeValidateGreen = () => {
    const count = document.querySelectorAll('.section-address .input-field.green-border').length;
    if (count === 4) {
      this.refs.validate.className = 'text-link clickable center-text no-margin validate-button validated';
      this.refs.validate.innerHTML = 'Validated &#10004;';
    } else {
      this.refs.validate.className = 'text-link clickable center-text no-margin validate-button';
      this.refs.validate.innerHTML = 'Validate';
    }
  }

  makeSubmitGreen = () => {
    const validElements = document.querySelectorAll('.input-field.green-border');
    const inputsRequired = document.querySelectorAll('.input-field.required');
    if (validElements.length === inputsRequired.length) {
      this.refs.submit.className = 'main-button clickable green-border';
    } else {
      this.refs.submit.className = 'main-button clickable black-border';
    }
  }

  checkZipCode = (event) => {
    const value = event.currentTarget.value;
    if (event.keyCode !== 8 && (event.keyCode < 48 || event.keyCode > 57)) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (value.length >= 5 && event.keyCode !== 8) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  checkState = (event) => {
    console.log('check State!');
    const value = event.currentTarget.value;
    if (event.keyCode !== 8) {
      if (event.keyCode < 65 || event.keyCode > 90) {
        if (event.keyCode < 97 || event.keyCode > 122) {
          event.stopPropagation();
          event.preventDefault();
        }
      }
    }
    if (value.length >= 2 && event.keyCode !== 8) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  validateString = (event) => {
    const element = event.currentTarget;
    const value = element.value;

    if (value.length >= 2) {
      element.className += ' green-border';
    } else {
      element.classList.remove('green-border');
    }
    this.makeSubmitGreen();
    this.makeValidateGreen();
  }

  validateZIP = (event) => {
    const isValidNumber = (obj) => {
      return !isNaN(parseFloat(obj)) && isFinite(obj);
    };

    const element = event.currentTarget;
    const value = element.value;

    if (value.length === 5 && isValidNumber(value)) {
      element.className += ' green-border';
    } else {
      element.classList.remove('green-border');
    }
    this.makeSubmitGreen();
    this.makeValidateGreen();
  }

  validateState = (event) => {
    const element = event.currentTarget;
    const value = element.value;

    if (value.length === 2) {
      element.className += ' green-border';
    } else {
      element.classList.remove('green-border');
    }
    this.makeSubmitGreen();
    this.makeValidateGreen();
  }

  validatePhone = (event) => {
    const element = event.currentTarget;
    const value = element.value;

    if (value && value.match(/\d/g).length === 10) {
      element.className += ' green-border';
    } else {
      element.classList.remove('green-border');
    }

    this.makeSubmitGreen();
    this.makeValidateGreen();
  }

  validateEmail = (event) => {
    const isValidEmail = function isValidEmail(email) {
      return /^.+@.+\..+$/.test(email);
    };
    const element = event.currentTarget;
    const value = element.value;

    if (isValidEmail(value)) {
      element.className += ' green-border';
    } else {
      element.classList.remove('green-border');
    }
    this.makeSubmitGreen();
    this.makeValidateGreen();
  }

  deleteAdditionalContact = (id) => {
    const obj = { ...this.state.additionalContacts };
    delete obj[id];
    this.setState({
      additionalContacts: obj
    });
  }

  render() {
    const anotherContactButton = (
      <div className="text-link clickable add-another-contact" onClick={this.addAnotherContact}>
        Add Additional Contact +
      </div>
    );

    let billingAddress = '';
    if (this.state.showBillingAdress) {
      billingAddress = (
        <div className="section section-address" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          marginTop: -50
        }}>
          <div className="section-head" style={{
            display: 'flex',
            flexDirection: 'row'
          }}>
            <div className="section-title bold-text right-margin-20">
              Billing Address
            </div>
          </div>
          <div className="input-row" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <input className="input-field capitalize required" placeholder="Street Address" type="text" onKeyUp={this.updateAddress} onKeyUp={this.validateString}/>
          </div>
          <div className="link-row" style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div className="input-row" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flexGrow: 200
            }}>
              <input className="input-field capitalize required" placeholder="City" type="text" onKeyUp={this.updateAddress} onKeyUp={this.validateString}/>
            </div>
            <div className="input-row" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <input className="input-field state-input uppercase required" placeholder="State" type="text" onKeyUp={this.validateState} onKeyDown={this.checkState}/>
            </div>
            <div className style={{
              flexGrow: 1
            }}>
              <input className="input-field zip-field required" placeholder="Zip" type="text" onKeyUp={this.validateZIP} onKeyDown={this.checkZipCode}/>
            </div>
          </div>
        </div>
      );
    }

    const anotherAddress = [];
    // if (this.state.numberOfAnotherAddress > 0) {
    const contacts = this.state.additionalContacts;
    if (Object.keys(contacts).length > 0) {
      for (const key in contacts) {
        if (!contacts.hasOwnProperty(key)) {
          continue;
        }
        const contact = contacts[key];
        const address = (
          <div key={key} className="section" ref={key} style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around'
          }}>
            <div className="section-head" style={{
              display: 'flex',
              flexDirection: 'row'
            }}>
              <div className="section-title bold-text right-margin-20">
                Additional Contact
              </div>
              <div className="text-link clickable" style={{
                marginTop: 3
              }} onClick={this.deleteAdditionalContact.bind(this, key)}>
                Remove
              </div>
              {/*<div className="hide">
            <img className="green-check" src="images/checkMark.svg" width="30px"/>
          </div>*/}
            </div>
            <div className="input-row" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <input ref={contact.firstname} className="input-field capitalize required " placeholder="First" type="text" onKeyUp={this.validateString}/>
            </div>
            <div className="input-row" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <input ref={contact.middlename} className="input-field  " placeholder="Middle" type="text"/>
            </div>
            <div className="input-row" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <input ref={contact.lastname} className="input-field capitalize required" placeholder="Last" type="text" onKeyUp={this.validateString}/>
            </div>
            <div className="input-row" style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div className style={{
                flexGrow: 1
              }}>
                <input ref={contact.phone} className="input-field phone-number-field required " placeholder="Phone" type="text" onKeyUp={this.validatePhone}/>
              </div>
              <div className style={{
                display: 'flex',
                flexDirection: 'row',
                flexGrow: 80
              }}>
                <input ref={contact.email} className="input-field full-width required" placeholder="Email" type="text" onKeyUp={this.validateEmail}/>
              </div>
            </div>
          </div>
        );
        anotherAddress.push(address);
      }

      // for (let index = 0; index < this.state.numberOfAnotherAddress; index++) {
      //   const address = (
      //     <div className="section" style={{
      //       display: 'flex',
      //       flexDirection: 'column',
      //       justifyContent: 'space-around'
      //     }}>
      //       <div className="section-head" style={{
      //         display: 'flex',
      //         flexDirection: 'row'
      //       }}>
      //         <div className="section-title bold-text right-margin-20">
      //           Additional Contact
      //         </div>
      //         <div className="text-link clickable" style={{
      //           marginTop: 3
      //         }} onClick={this.deleteAdditionalContact}>
      //           Remove
      //         </div>
      //         {/*<div className="hide">
      //       <img className="green-check" src="images/checkMark.svg" width="30px"/>
      //     </div>*/}
      //       </div>
      //       <div className="input-row" style={{
      //         display: 'flex',
      //         flexDirection: 'column',
      //         justifyContent: 'center'
      //       }}>
      //         <input className="input-field capitalize required " placeholder="First" type="text" onKeyUp={this.validateString}/>
      //       </div>
      //       <div className="input-row" style={{
      //         display: 'flex',
      //         flexDirection: 'column',
      //         justifyContent: 'center'
      //       }}>
      //         <input className="input-field  " placeholder="Middle" type="text"/>
      //       </div>
      //       <div className="input-row" style={{
      //         display: 'flex',
      //         flexDirection: 'column',
      //         justifyContent: 'center'
      //       }}>
      //         <input className="input-field capitalize required" placeholder="Last" type="text" onKeyUp={this.validateString}/>
      //       </div>
      //       <div className="input-row" style={{
      //         display: 'flex',
      //         flexDirection: 'row',
      //         justifyContent: 'space-between',
      //         alignItems: 'center'
      //       }}>
      //         <div className style={{
      //           flexGrow: 1
      //         }}>
      //           <input className="input-field phone-number-field required " placeholder="Phone" type="text" onKeyUp={this.validatePhone}/>
      //         </div>
      //         <div className style={{
      //           display: 'flex',
      //           flexDirection: 'row',
      //           flexGrow: 80
      //         }}>
      //           <input className="input-field full-width required" placeholder="Email" type="text" onKeyUp={this.validateEmail}/>
      //         </div>
      //       </div>
      //     </div>
      //   );
      //
      //   anotherAddress.push(address);
      // }
    }

    require('./NewLead.scss');

    return (
      <div className="new-lead-page" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div className="section" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around'
        }}>
          <div className="section-head" style={{
            display: 'flex',
            flexDirection: 'row'
          }}>
            <div className="section-title bold-text right-margin-20">
              Primary Contact
            </div>
            {/*<div className="hide">
              <img className="green-check" src="images/checkMark.svg" width="30px"/>
            </div>*/}
          </div>
          <div className="input-row" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <input className="input-field required capitalize" placeholder="First" type="text" ref="firstName" onChange={this.updateName} onKeyUp={this.validateString}/>
          </div>
          <div className="input-row" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <input className="input-field capitalize" placeholder="Middle" type="text" ref="middleName" onChange={this.updateName}/>
          </div>
          <div className="input-row" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <input className="input-field required capitalize" placeholder="Last" type="text" ref="lastName" onChange={this.updateName} onKeyUp={this.validateString}/>
          </div>
          <div className="input-row" style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div className style={{
              flexGrow: 1
            }}>
              <input className="input-field phone-number-field required" ref="phone" placeholder="Phone" type="text" onKeyUp={this.validatePhone}/>
            </div>
            <div className style={{
              display: 'flex',
              flexDirection: 'row',
              flexGrow: 80
            }}>
              <input className="input-field full-width required" placeholder="Email" ref="email" type="text" onKeyUp={this.validateEmail}/>
            </div>
          </div>
        </div>
        {anotherAddress}
        {anotherContactButton}
        <div className="section section-address" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around'
        }}>
          <div className="section-head" style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div className="section-title bold-text right-margin-20">
              Solar Address
            </div>

            <div className="link-row " style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}>
              <div className="section-head" style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}>
                <div className="right-margin-30" style={{
                  fontSize: '1rem'
                }}>
                  Solar Address and Billing Address
                </div>
              </div>
              <div className="right-margin-30 option-input" style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                flexGrow: 1,
                paddingBottom: 10
              }}>
                <div className={this.state.showBillingAdress
                  ? 'text-link clickable'
                  : 'text-link clickable activated'} onClick={this.billingAddressFalse}>Same</div>
              </div>
              <div className="option-input" style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                flexGrow: 5,
                paddingBottom: 10
              }}>
                <div className={!this.state.showBillingAdress
                  ? 'text-link clickable'
                  : 'text-link clickable activated'} onClick={this.billingAddressTrue}>Unique</div>
              </div>
            </div>
          </div>
          <div className="input-row" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <input value={this.state.populatedAddress.street} className="input-field required capitalize" placeholder="Street Address" type="text" ref="street" onKeyUp={this.updateAddress} onKeyUp={this.validateString}/>
          </div>
          <div className="link-row" style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div className="input-row" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flexGrow: 200
            }}>
              <input value={this.state.populatedAddress.city} className="input-field required capitalize" placeholder="City" type="text" ref="city" onKeyUp={this.updateAddress} onKeyUp={this.validateString}/>
            </div>
            <div className="input-row" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <input value={this.state.populatedAddress.state} className="input-field state-input required uppercase" placeholder="State" ref="state" type="text" onKeyUp={this.validateState} onKeyDown={this.checkState}/>
            </div>
            <div className style={{
              flexGrow: 1
            }}>
              <input value={this.state.populatedAddress.postalcode} className="input-field zip-field required" placeholder="Zip" type="text" ref="zip" onKeyUp={this.validateZIP} onKeyDown={this.checkZipCode}/>
            </div>
          </div>
          <div className="link-row" style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div className="flex-start" style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              flexGrow: 1
            }}>
              <div ref="validate" className="text-link clickable center-text no-margin validate-button">Validate</div>
            </div>
            <div className style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              flexGrow: 5
            }}>
              <div className="text-link clickable center-text" onClick={this.getAddressFromGPS}>
                Load Current Location
              </div>
            </div>
            <div className style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              flexGrow: 1
            }}>
              <div className="text-link clickable center-text">
                Enter Longitute &amp; Latitude
              </div>
            </div>
          </div>
          {billingAddress}
        </div>

        <div className="link-row test-data" style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          position: 'relative',
          top: 30
        }}>
          <div className="section-head" style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}>
            <div className="right-margin-30" style={{
              fontSize: '1rem'
            }}>
              Data is for Testing/Training Purposes:
            </div>
          </div>
          <div className="right-margin-30 option-input" style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            flexGrow: 1,
            paddingBottom: 10
          }}>
            <div onClick={() => {
              this.setState({testData: true});
            }} className={this.state.testData
              ? 'text-link clickable activated'
              : 'text-link clickable'}>Yes</div>
          </div>
          <div className="option-input" style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            flexGrow: 5,
            paddingBottom: 10
          }}>
            <div onClick={() => {
              this.setState({testData: false});
            }} className={!this.state.testData
              ? 'text-link clickable activated'
              : 'text-link clickable'}>No</div>
          </div>
        </div>

        <div className="section form-buttons" style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          width: '60%',
          minWidth: 500,
          maxWidth: 700,
          margin: '0 auto'
        }}>
          <div className="other-button clickable black-border" onClick={this.actionPartial} style={{
            visibility: (this.state.createMode || this.props.lead.type === 'partial')
              ? 'visible'
              : 'hidden'
          }}>
            <div>{this.state.createMode
                ? 'Submit'
                : 'Update'}<br/>
              Partial</div>
          </div>
          <div className="main-button clickable black-border" ref="submit" onClick={this.onSubmitClick}>{this.state.createMode ? 'Submit' : 'Save Changes'}</div>
          <div className="other-button clickable black-border" onClick={this.onCancel}>Cancel</div>
        </div>

      </div>

    );
  }
}
