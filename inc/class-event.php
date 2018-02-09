<?php
/**
 * Event class
 *
 * This is a class that defines an event handler, its available actions and recipient callbacks, and its UI.
 *
 * @link https://github.com/humanmade/Workflow/issues/1
 *
 * @package HM\Workflow
 * @since 0.1.0
 */

namespace HM\Workflow;

/**
 * Class Event
 */
class Event {

	/**
	 * Events array.
	 *
	 * @var array
	 */
	protected static $events = [];

	/**
	 * Collection of registered event listeners.
	 *
	 * @var array
	 */
	protected $listeners = [];

	/**
	 * Array of key/value pairs that can be substituted into the message delivered to the destination.
	 *
	 * @var array
	 */
	protected $message_tags = [];

	/**
	 *  Event message actions.
	 *
	 * @var array
	 */
	protected $message_actions = [];

	/**
	 * Event recipient handlers.
	 *
	 * @var array
	 */
	protected $recipients_handlers = [];

	/**
	 * Event UI.
	 *
	 * @var UI
	 */
	protected $ui;

	/**
	 * Event name.
	 *
	 * @var string
	 */
	protected $name = '';

	/**
	 * Creates a new Event object.
	 *
	 * @param string $id Event ID.
	 */
	public static function register( $id ) :Event {
		$event               = new self( $id );
		self::$events[ $id ] = $event;

		return $event;
	}

	/**
	 * Event constructor.
	 *
	 * @param string $id Event ID.
	 */
	protected function __construct( $id ) {
		$this->id = $id;
	}

	/**
	 * Adds a listener.
	 *
	 * @param string|array|callable $action The action to perform.
	 *
	 * @return mixed
	 */
	public function add_listener( $action ) {
		$this->recipients_handlers[] = $action;

		return $this;
	}

	/**
	 * Adds the message tags.
	 *
	 * @param array|callable $tags Array of key/value pairs.
	 *
	 * @return array
	 */
	public function add_message_tags( $tags ) :array {
		$this->message_tags = array_merge( $this->message_tags, $tags );

		return $this->message_tags;
	}

	/**
	 * Adds a message action.
	 *
	 * @param string          $id              A reference name for the action.
	 * @param string          $text            The link or button text for the action.
	 * @param string|callable $callback_or_url Description.
	 * @param null|callable   $args            An optional function that receives the return value of the event action.
	 * @param array           $schema          An array of accepted $_GET arguments and their corresponding sanitisation callback.
	 *
	 * @return $this
	 */
	public function add_message_action( $id, $text, $callback_or_url, $args = null, array $schema ) {
		// @todo: handle this
		return $this;
	}

	/**
	 * This method should add the $name and $callback parameter to $this->recipient_handlers with $id as the key.
	 *
	 * @param string   $id       An identifier for the recipient handler to be used in the WorkFlow()->who() method.
	 * @param string   $name     A nice name to be shown in the UI.
	 * @param callable $callback This receives the event action value as it’s 1st parameter and should return one or an array of email addresses, user objects, user IDs or user roles.
	 *
	 * @return $this
	 */
	public function add_recipient_handler( $id, $name, $callback ) {
		$this->recipients_handlers[ $id ] = $callback;
		return $this;
	}

	/**
	 * Set the $this->ui property to the UI object.
	 *
	 * @param string|UI $ui A nice name to show in the UI or a UI object.
	 *
	 * @return $this
	 */
	public function add_ui( $ui ) {
		if ( is_string( $ui ) ) {
			$this->ui = UI::register( $this->id );
		}
		$this->ui->set_key( 'event_' . $this->id );

		return $this;
	}

	/**
	 * Gets an Event from the collection by ID.
	 *
	 * @param string $id Event ID.
	 *
	 * @return Event|null
	 */
	public static function get( $id ) {
		return self::$events[ $id ] ?? null;
	}

	/**
	 * Gets the Event listeners.
	 *
	 * @return array
	 */
	public function get_listeners() : array {
		return empty( $this->listeners ) ? [ $this->id ] : $this->listeners;
	}

	/**
	 * Gets the message tags.
	 *
	 * @return array
	 */
	public function get_message_tags() : array {
		return $this->message_tags;
	}

	/**
	 * Gets the recipeint handler function.
	 *
	 * @param strin $id The handler ID.
	 *
	 * @return callable
	 */
	public function get_recipient_handler( $id ) : callable {
		return $this->recipients_handler[ $id ];
	}

	/**
	 * Gets the message actions.
	 *
	 * @return array
	 */
	public function get_message_actions() : array {
		return $this->message_actions;
	}

	/**
	 * Gets the Event UI object.
	 *
	 * @return UI
	 */
	public function get_ui() : UI {
		return $this->ui;
	}
}
