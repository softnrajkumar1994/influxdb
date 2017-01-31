import React, {PropTypes} from 'react';
import Dropdown from 'shared/components/Dropdown';
import ReactTooltip from 'react-tooltip';
import {RULE_MESSAGE_TEMPLATES as templates} from '../constants/index.js';

const DEFAULT_ALERTS = ['http', 'tcp'];

const {
  arrayOf,
  func,
  shape,
  string,
} = PropTypes;

export const RuleMessage = React.createClass({
  propTypes: {
    rule: shape({}).isRequired,
    actions: shape({
      updateMessage: func.isRequired,
    }).isRequired,
    enabledAlerts: arrayOf(string.isRequired).isRequired,
  },

  getInitialState() {
    return {
      selectedAlert: null,
    };
  },

  handleChangeMessage() {
    const {actions, rule} = this.props;
    actions.updateMessage(rule.id, this.message.value);
  },

  handleChooseAlert(item) {
    const {actions} = this.props;
    actions.updateAlerts(item.ruleID, [item.text]);
    this.setState({selectedAlert: item.text});
  },

  render() {
    const {rule, actions, enabledAlerts} = this.props;
    const defaultAlertEndpoints = DEFAULT_ALERTS.map((text) => {
      return {text, ruleID: rule.id};
    });
    const alerts = enabledAlerts.map((text) => {
      return {text, ruleID: rule.id};
    }).concat(defaultAlertEndpoints);

    return (
      <div className="kapacitor-rule-section">
        <h3 className="rule-section-heading">Alert Message</h3>
        <div className="rule-section-body">
          <textarea
            className="alert-message"
            ref={(r) => this.message = r}
            onChange={() => actions.updateMessage(rule.id, this.message.value)}
            placeholder='Example: {{ .ID }} is {{ .Level }} value: {{ index .Fields "value" }}'
            value={rule.message}
          />

          <div className="alert-message--formatting">
            <p>Templates:</p>
            {
              Object.keys(templates).map(t => {
                return (
                <CodeData
                  key={t}
                  template={templates[t]}
                  onClickTemplate={() => actions.updateMessage(rule.id, `${this.message.value} ${templates[t].label}`)}
                />
                );
              })
            }
            <ReactTooltip effect="solid" html={true} offset={{top: -4}} class="influx-tooltip kapacitor-tooltip" />
          </div>
          <div className="rule-section--item bottom alert-message--endpoint">
            <p>Send this Alert to:</p>
            <Dropdown className="size-256 dropdown-kapacitor" selected={rule.alerts[0] || 'Choose an output'} items={alerts} onChoose={this.handleChooseAlert} />
            {this.renderInput(this.state.selectedAlert)}
          </div>
        </div>
      </div>
    );
  },

  renderInput(alert) {
    if (!DEFAULT_ALERTS.find((a) => a === alert)) {
      return null;
    }

    return <input className="form-control col-xs-6" type="text" ref={(r) => this.selectedAlert = r} />;
  },
});

const CodeData = React.createClass({
  propTypes: {
    onClickTemplate: func,
    template: shape({
      label: string,
      text: string,
    }),
  },

  render() {
    const {onClickTemplate, template} = this.props;
    const {label, text} = template;

    return (
      <code data-tip={text} onClick={onClickTemplate}>{label}</code>
    );
  },
});

export default RuleMessage;
