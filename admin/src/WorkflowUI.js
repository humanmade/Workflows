/*global HM*/
import React, { Component } from 'react';
import Portal from './Portal';
import 'react-toggle/style.css';
import Toggle from 'react-toggle';
import 'react-select/dist/react-select.css';
import Select from 'react-select';
import Editor from './Editor';
import styled from 'styled-components';

const Field = styled.div`
	margin: 0 0 1em;
	display: flex;

	label {
		flex: 0 1 100px;
	}
	
	label ~ * {
		flex: 1;
	}
`

class WorkflowUI extends Component {
	constructor() {
		super();

		this.state = {
			enabled:      false,
			event:        '',
			subject:      '',
			message:      '',
			recipients:   [],
			destinations: [],
		};
	}

	componentWillMount() {
		// Fetch post data and set initial state.
		// fetch( `${ HM.Workflows.Namespace }/workflows/${ this.props.postId }`, {
		// 	credentials: 'same-origin',
		// 	headers:     {
		// 		'X-WP-Nonce': HM.Workflows.Nonce,
		// 	}
		// } );
	}

	render() {
		const availableDestinations = HM.Workflows.Destinations
			.filter( destination => this.state.destinations.map( dest => dest.id ).indexOf( destination.id ) < 0 );
		const availableRecipients = HM.Workflows.Recipients
			.filter( recipient => this.state.recipients.map( rec => rec.id ).indexOf( recipient.id ) < 0 );
		const eventObject = HM.Workflows.Events
			.find( event => event.id === this.state.event )

		return <div className="hm-workflow-ui-wrap">

			<Portal target="hm-workflow-options">
				<div className="hm-workflow-options__enabled">
					<label htmlFor="hm-workflow-enabled">
						<Toggle id="hm-workflow-enabled"
						        name="workflow-enabled"
						        value="1"
						        defaultChecked={this.props.enabled}
						        checked={this.state.checked}
						        onChange={() => this.setState( { enabled: ! this.state.enabled } )}
						        icons={false}
						/>
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
					options={HM.Workflows.Events.map( event => ({
						value:  event.id,
						label:  event.ui.name,
						object: event
					}) )}
					name="when"
					value={this.state.event}
					onChange={option => this.setState( { event: option.value } )}
					resetValue=""
				/>
			</div>

			{ this.state.event &&
			  <div className="hm-workflow-ui-what">
					<h3>What message should be sent?</h3>

					<Field>
					  <label htmlFor="subject">Subject</label>
						<Editor
							id="subject"
							type="text"
							name="subject"
							ref="subject"
							placeholder="Briefly state what has happened or the action to take..."
							content={eventObject.ui.name}
							onChange={content => this.setState( { subject: content } )}
							tags={eventObject && eventObject.tags}
						/>
					</Field>

				  <Field>
					  <label htmlFor="message">Message</label>
						<Editor
							id="message"
							name="message"
							placeholder="Add an optional detailed message here..."
							ref="message"
							content={''}
							onChange={content => this.setState( { message: content } )}
							tags={eventObject && eventObject.tags}
						/>
				  </Field>

					{eventObject && eventObject.actions.length
						? <div className="hm-workflow-ui-message-actions">
								<p>The following action links will be added to the message.</p>
								<ul>
									{ eventObject.actions.map( action => {
										return <li key={action.id}>{action.text}</li>;
									} ) }
								</ul>
							</div>
						: null
					}
				</div>
			}

			{ this.state.event && this.state.subject &&
			  <div className="hm-workflow-ui-who">
					<h3>Who should be notified?</h3>
					{this.state.recipients.map( recipient => {
						return <div key={recipient.id}>
							<h4>{recipient.name}</h4>
							{recipient.items && <Select
								options={recipient.items}
								multi={recipient.multi}
							/>}
							<button
								onClick={() => this.setState( { recipients: this.state.recipients.filter( rec => rec.id !== recipient.id ) } )}>Remove
							</button>
						</div>
					} )}
					{availableRecipients.length
						? <Select
							options={HM.Workflows.Recipients.map( recipient => ({ label: recipient.name, object: recipient }) )}
							name="who[]"
							placeholder={this.state.recipients.length ? 'Select another...' : 'Select...'}
							onChange={option => this.setState( { recipients: this.state.recipients.concat( [ option.object ] ) } )}
						/>
						: null
					}
				</div>
			}

			{ this.state.event && this.state.subject && this.state.recipients &&
			  <div className="hm-workflow-ui-where">
					<h3>Where should they be notified?</h3>
					{this.state.destinations.map( destination => {
						return <div key={destination.id}>
							<h4>{destination.ui.name}</h4>
							{/*Form*/}
							<button
								onClick={() => this.setState( { destinations: this.state.destinations.filter( dest => dest.id !== destination.id ) } )}>Remove
							</button>
						</div>
					} )}
					{availableDestinations.length
						? <Select
							options={availableDestinations.map( destination => ({
								value:  destination.id,
								label:  destination.ui.name,
								object: destination
							}) )}
							name="where[]"
							placeholder={this.state.destinations.length ? 'Select another...' : 'Select...'}
							onChange={option => this.setState( {
								destinations: this.state.destinations.concat( [ option.object ] )
							} )}
						/>
						: null
					}
				</div>
			}
		</div>;
	}
}

export default WorkflowUI;
