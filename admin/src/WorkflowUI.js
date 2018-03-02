/*global HM*/
import React, { Component } from 'react';
import Portal from './Portal';
import withFetch from './withFetch';
import 'react-toggle/style.css';
import Toggle from 'react-toggle';
import 'react-select/dist/react-select.css';
import Select from 'react-select';

class WorkflowUI extends Component {
	constructor() {
		super();

		this.state = {
			event: null,
			subject: null,
			message: null,
			recipient: null,
			recipients: [],
			destination: null,
		};
	}

	render() {
		const UI = props => <div key="ui" className="hm-workflow-ui-wrap">
			<Portal key="options" target="hm-workflow-options">
				<div className="hm-workflow-options__enabled">
					<label htmlFor="hm-workflow-enabled">
						<Toggle id="hm-workflow-enabled" name="workflow-enabled" value="1"
						        defaultChecked={this.props.enabled}
						        icons={false}/>
						Enabled
					</label>
				</div>
				<div className="hm-workflow-options__actions">
					<button className="button button-primary">Save</button>
				</div>
			</Portal>
			<div className="hm-workflow-ui-when">
				<h3>When should the workflow run?</h3>
				<Select
					options={HM.Workflows.Events.map( event => ({ value: event.id, label: event.ui.name }) )}
				/>
			</div>

			<div className="hm-workflow-ui-what">
				<h3>What message should be sent?</h3>
				<input type="text" name="subject" placeholder="Subject..."/>
			</div>

			<div className="hm-workflow-ui-who">
				<h3>Who should be notified?</h3>
				<Select
					options={HM.Workflows.Recipients.map( recipient => ({ label: recipient.label }) )}
				/>
			</div>

			<div className="hm-workflow-ui-where">
				<h3>Where should they be notified?</h3>
				<Select
					options={HM.Workflows.Destinations.map( destination => ({ value: destination.id, label: destination.ui.name }) )}
				/>
			</div>
		</div>;

		const UIwithFetch = withFetch( `${ HM.Workflows.Namespace }/workflows/${ this.props.postId }`, {
			credentials: 'same-origin',
			headers:     {
				'X-WP-Nonce': HM.Workflows.Nonce,
			}
		} )( UI );

		return this.props.postId
			? <UIwithFetch/>
			: <UI/>;
	}
}

export default WorkflowUI;
