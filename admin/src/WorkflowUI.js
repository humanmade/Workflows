/*global HM*/
import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import Portal from './Portal';
import 'react-toggle/style.css';
import Toggle from 'react-toggle';
import 'react-select/dist/react-select.css';
import Select, { Async as AsyncSelect } from 'react-select';
import Editor from './Editor';
import styled, { css } from 'styled-components';
import './Fields';

const StyledQuestionBox = styled.div`
	margin-top: 10px;
	padding: 0 0 10px 0;
	
	.hm-workflows-arrow {
		display: block;
		width: 40%;
		height: 1px;
		background: rgba(0,0,0,.25);
		position: relative;
		margin: 0 auto 50px;
	
		&:before {
			position: absolute;
			top: 0px;
			content: '';
			background: rgba(0,0,0,.25);
			width: 1px;
			height: 50px;
			margin-left: 50%;
		}
		
		&:after {
			position: absolute;
			top: 50px;
			left: -4px;
			content: '';
			background: rgba(0,0,0,.25);
			width: 9px;
			height: 9px;
			border-radius: 100px;
			margin-left: 50%;
		}
	}
	
	&.hm-question-appear,
	&.hm-question-enter {
		.hm-workflows-arrow {
			width: 0;
			&:before {
				height: 0;
			}
			&:after {
				opacity: 0.01;
				top: 0;
			}
		}
		
		.hm-question-body {
			position: relative;
			opacity: 0.01;
			top: 100px;
		}
	}
	
	&.hm-question-appear.hm-question-appear-active,
	&.hm-question-enter.hm-question-enter-active {
		.hm-workflows-arrow {
			width: 40%;
			transition: width .65s ease-out;
			&:before {
				height: 50px;
				transition: height .5s ease-out .25s;
			}
			&:after {
				opacity: 1;
				top: 50px;
				transition: top .5s ease-out .25s, opacity .5s ease-out;
			}
		}
	
		.hm-question-body {
			transition: opacity .65s ease-out .25s, top .3s ease-out .25s;
			opacity: 1;
			top: 0;
		}
	}
	
	&.hm-question-exit {
		.hm-question-body {
			position: relative;
			opacity: 1;
			top: 0;
		}
		
		.hm-workflows-arrow {
			width: 40%;
			opacity: 1;
		}
	}
	
	&.hm-question-exit.hm-question-exit-active {
		.hm-workflows-arrow {
			width: 0;
			opacity: 0;
			transition: width .3s ease-in, opacity .25s ease-in;
		}
	
		.hm-question-body {
			transition: opacity .3s ease-in, top .3s ease-in;
			opacity: 0;
			top: 200px;
		}
	}
`

const QuestionBox = props => <CSSTransition
	timeout={1000}
	classNames="hm-question"
	appear={true}
	mountOnEnter={true}
	unmountOnExit={true}
	in={props.in}
>
	<StyledQuestionBox {...props}>
		{props.step && props.step > 1 && <span className="hm-workflows-arrow"/>}
		<div className="hm-question-body">
			{props.children}
		</div>
	</StyledQuestionBox>
</CSSTransition>;

const Question = styled.h3`
	text-align: center;
	padding: 20px 0 15px;
	margin: 0;
`

const MessageActions = styled.div`
	p {
		font-style: italic;
	}
	ul {
		list-style: none;
	}
	li {
		display: inline-block;
		margin-right: 5px;
	}
`

const Form = styled.div`
	margin-bottom: 20px;
	
	${ props => props.hasFields && css`
		display: flex;
	` }
`

const StyledFieldset = styled.fieldset`
	flex: 1;
	
	& ~ fieldset {
		margin-left: 10px;
	}
	
	&.hm-workflows-fields-enter,
	&.hm-workflows-fields-appear {
		opacity: 0.01;
	}
	
	&.hm-workflows-fields-enter.hm-workflows-fields-enter-active,
	&.hm-workflows-fields-appear.hm-workflows-fields-appear-active {
		opacity: 1;
		transition: opacity .3s ease-out;
	}
	
	&.hm-workflows-fields-exit {
		opacity: 1;
	}
	
	&.hm-workflows-fields-exit.hm-workflows-fields-exit-active {
		opacity: 0;
		transition: opacity .3s ease-in;
	}
`

const Fieldset = props => <CSSTransition
	appear={true}
	timeout={1000}
	in={props.in}
	classNames="hm-workflows-fields"
>
	<StyledFieldset {...props}>
		{props.children}
	</StyledFieldset>
</CSSTransition>;

const Field = styled.div`
	margin: 0 auto 1em;
	padding: 8px 0;
	
	label {
		font-weight: bold;
		display: block;
	}
`

class WorkflowUI extends Component {
	constructor() {
		super();

		this.state = {
			enabled:        false,
			saving:         false,
			event:          '',
			eventObject: null,
			subject:        '',
			defaultSubject: '',
			message:        '',
			defaultMessage: '',
			recipients:     [],
			destinations:   [],
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

	saveWorkflow() {

		this.setState( { saving: true } );

		// fetch( `${ HM.Workflows.Namespace }/workflows/${ this.props.postId }`, {
		// 	credentials: 'same-origin',
		//  method: 'POST',
		// 	headers:     {
		// 		'X-WP-Nonce': HM.Workflows.Nonce,
		// 	}
		// } );

	}

	render() {
		const availableDestinations = HM.Workflows.Destinations
			.filter( destination => this.state.destinations.map( dest => dest.id ).indexOf( destination.id ) < 0 );
		const eventObject = HM.Workflows.Events
			.find( event => event.id === this.state.event )
		const availableRecipients = HM.Workflows.Recipients
			.concat( ( eventObject && eventObject.recipients ) || [] )
			.filter( recipient => this.state.recipients.map( rec => rec.id ).indexOf( recipient.id ) < 0 );

		return <div className="hm-workflow-ui-wrap">

			<Portal target="hm-workflow-options">
				<div className="hm-workflow-options__enabled">
					<label htmlFor="hm-workflow-enabled">
						<Toggle
							id="hm-workflow-enabled"
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
					<button
						type="button"
						className={`button button-primary ${this.state.saving && 'disabled'}`}
						onClick={() => this.saveWorkflow()}
					>
						{this.state.saving ? 'Saving' : 'Save'}
					</button>
					<span className={`spinner ${this.state.saving && 'is-acgive'}`}/>
				</div>
			</Portal>

			<QuestionBox step={1} in={true}>
				<Question>When should the workflow run?</Question>
				<Fieldset in={true}>
					<Select
						options={HM.Workflows.Events.map( event => ({
							value:  event.id,
							label:  event.ui.name,
							object: event
						}) )}
						name="when"
						value={this.state.event}
						onChange={option => this.setState( {
							event:          option.value,
							eventObject:    option.object || null,
							defaultSubject: option.value
								                ? HM.Workflows.Events.find( event => event.id === option.value ).ui.name
																: ''
						}, () => {
							this.refs.subject.focus();
						} )}
						resetValue=""
					/>
				</Fieldset>
				<Fieldset in={!!(this.state.eventObject && this.state.eventObject.ui.fields)}>
					{this.state.eventObject.ui.fields.map( field => {
						const Input = HM.Workflows.Fields[ field.type || 'text' ];

						if ( ! Input ) {
							return null;
						}

						return <Field key={field.name} type={field.type || 'text'}>
							<Input
								{...field}
								value={destination.ui.data[ field.name ]}
								description={field.params && field.params.description}
								onChange={value => this.setState( {
									eventObject: Object.assign( {}, this.state.eventObject, {
										ui: Object.assign( {}, this.state.eventObject.ui, {
											data: Object.assign( {}, this.state.eventObject.ui.data, {
												[field.name]: value
											} )
										} )
									} )
								} ) }
							/>
						</Field>
					} )}
				</Fieldset>
			</QuestionBox>

			<QuestionBox step={2} in={!!this.state.event}>
				<Question>What message should be sent?</Question>

				<Field>
					<label htmlFor="subject">Subject</label>
					<Editor
						id="subject"
						type="text"
						name="subject"
						ref="subject"
						placeholder="Briefly state what has happened or the action to take..."
						content={this.state.defaultSubject}
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
					? <MessageActions>
						<p>The following actions will be added to the message.</p>
						<ul>
							{eventObject.actions.map( action => {
								return <li key={action.id}><span className="button button-secondary">{action.text}</span></li>;
							} )}
						</ul>
					</MessageActions>
					: null
				}
			</QuestionBox>

			<QuestionBox step={3} in={!!(this.state.event && this.state.subject)}>
				<Question>Who should be notified?</Question>
				{this.state.recipients.map( recipient => {
					return <Form key={recipient.id} hasFields={recipient.items || recipient.endpoint}>
						<Fieldset in={true}>
							<Select
								value={recipient.id}
								options={[ { value: recipient.id, label: recipient.name } ]}
								onInputChange={value => {
									if ( ! value ) {
										this.setState( { recipients: this.state.recipients.filter( rec => rec.id !== recipient.id ) } )
									}
								}}
								openOnClick={false}
								searchable={false}
								menuRenderer={() => null}
								onBlurResetsInput={false}
								onCloseResetsInput={false}
							/>
						</Fieldset>
						<Fieldset in={!!(recipient.items)}>
							<Select
								options={recipient.items}
								multi={recipient.multi}
								value={recipient.value}
								onChange={option => this.setState( {
									recipients: this.state.recipients.map( rec => {
										if ( rec.id !== recipient.id ) {
											return rec;
										}
										return Object.assign( {}, rec, {
											value: rec.multi ? option.map( opt => opt.value ) : option.value
										} );
									} )
								} )}
							/>
						</Fieldset>
						<Fieldset in={!!(recipient.endpoint)}>
							<AsyncSelect
								options={recipient.items}
								multi={recipient.multi}
								autoload={true}
								loadOptions={input => fetch( `${recipient.endpoint.url}?search=${encodeURIComponent( input )}`, {
									credentials: 'same-origin',
									headers:     {
										'X-WP-Nonce': HM.Workflows.Nonce
									}
								} )
									.then( response => response.json() )
									.then( data => ({ options: data }) )
								}
								value={recipient.value}
								labelKey={recipient.endpoint.labelKey || 'name'}
								valueKey={recipient.endpoint.valueKey || 'id'}
								onChange={option => this.setState( {
									recipients: this.state.recipients.map( rec => {
										if ( rec.id !== recipient.id ) {
											return rec;
										}
										return Object.assign( {}, rec, {
											value: rec.multi
												       ? option.map( opt => opt[ recipient.endpoint.valueKey || 'id' ] )
												       : option[ recipient.endpoint.valueKey || 'id' ]
										} );
									} )
								} )}
							/>
						</Fieldset>
					</Form>
				} )}
				{availableRecipients.length
					? <Select
						options={availableRecipients.map( recipient => ({ label: recipient.name, object: recipient }) )}
						name="who[]"
						placeholder={this.state.recipients.length ? 'Select another...' : 'Select...'}
						onChange={option => this.setState( { recipients: this.state.recipients.concat( [ option.object ] ) } )}
					/>
					: null
				}
			</QuestionBox>

			<QuestionBox step={4} in={!!(this.state.event && this.state.subject && this.state.recipients)}>
				<Question>Where should they be notified?</Question>
				{this.state.destinations.map( destination => {
					return <Form key={destination.id} hasFields={destination.ui.fields}>
						<Fieldset in={true}>
							<Select
								value={destination.id}
								options={[ { value: destination.id, label: destination.ui.name } ]}
								onInputChange={value => {
									if ( ! value ) {
										this.setState( { destinations: this.state.destinations.filter( dest => dest.id !== destination.id ) } )
									}
								}}
								openOnClick={false}
								searchable={false}
								menuRenderer={() => null}
								onBlurResetsInput={false}
								onCloseResetsInput={false}
							/>
						</Fieldset>
						<Fieldset in={!!(destination.ui.fields)}>
							{destination.ui.fields.map( field => {
								const Input = HM.Workflows.Fields[ field.type || 'text' ];

								if ( ! Input ) {
									return null;
								}

								return <Field key={field.name} type={field.type || 'text'}>
									<Input
										{...field}
										value={destination.ui.data[ field.name ]}
										description={field.params && field.params.description}
										onChange={value => this.setState( {
											destinations: this.state.destinations.map( dest => {
												if ( dest.id !== destination.id ) {
													return dest;
												}

												const data = Object.assign( {}, dest.ui.data, { [ field.name ]: value } );
												const ui = Object.assign( {}, dest.ui, { data } );

												return Object.assign( {}, dest, { ui } );
											} )
										} )}
									/>
								</Field>
							} )}
						</Fieldset>
					</Form>
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
			</QuestionBox>

		</div>;
	}
}

export default WorkflowUI;
