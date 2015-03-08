'use strict';

// Get the categories for the cases.
exports.index = function(req, res) {
  return res.jsonp([{
    id: 'Eaves Dropping',
    value: '_EAVES_DROPPING_'
  }, {
    id: 'Data Modification',
    value: '_DATA_MODIFICATION_'
  }, {
    id: 'IP Spoofing',
    value: '_IP_SPOOFING_'
  }, {
    id: 'Password Based Attack',
    value: '_PASSWORD_BASED_ATTACK_'
  }, {
    id: 'Denial of Service',
    value: '_DENIAL_OF_SERVICE_'
  }, {
    id: 'Man In The Middle',
    value: '_MAN_IN_THE_MIDDLE_'
  }, {
    id: 'Compromised Key Attack',
    value: '_COMPROMISED_KEY_ATTACK_'
  }, {
    id: 'Sniffer Attack',
    value: '_SNIFFER_ATTACK_'
  }, {
    id: 'Application Layer Attack',
    value: '_APPLICATION_LAYER_ATTACK_'
  }, {
    id: 'Undefined',
    value: '_UNDEFINED_'
  }]);
};