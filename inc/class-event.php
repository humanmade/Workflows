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
	 * @var array Collection of registered Event objects.
	 */
	protected static $events = [];

	/**
	 * @var array Collection of registered event listeners.
	 */
	protected $listeners = [];

	/**
	 * @var array Array of key/value pairs that can be substituted into the message delivered to the destination.
	 */
	protected $message_tags = [];

	/**
	 * @var
	 */
	protected $message_actions = [];

	/**
	 * @var
	 */
	protected $recipients_handlers = [];

	/**
	 * @var UI
	 */
	protected $ui;

	/**
	 * @var
	 */
	protected $name = '';

	/**
	 * Creates a new Event object.
	 *
	 * @param string $id Event ID.
	 */
	public static function register( $id ) {
		$event               = new self( $id );
		self::$events[ $id ] = $event;

		return $event;
	}

	/**
	 * Event constructor.
	 *
	 * @param $id
	 */
	protected function __construct( $id ) {
		$this->id = $id;
	}

	/**
	 * @param string|array|callable $action
	 *
	 * @return mixed
	 */
	public function add_listener( $action ) {
		$this->recipients_handlers[] = $action;

		return $this;
	}

	/**
	 * @param array|callable $tags Array of key/value pairs.
	 *
	 * @return array
	 */
	public function add_message_tags( $tags ) {
		$this->message_tags = array_merge( $this->message_tags, $tags );

		return $this->message_tags;
	}

	/**
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
	 * @param string $ui A nice name to show in the UI or a UI object.
	 *
	 * @return $this
	 */
	public function add_ui( $ui ) {
		if ( is_string( $ui ) ) {
			$this->ui = new UI( $ui );
		}

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
	public function get_listeners() {
		if ( empty( $this->listeners ) ) {
			return [ $this->id ];
		}

		return $this->listeners;
	}

	/**
	 * Gets the message tags.
	 *
	 * @return array
	 */
	public function get_message_tags() {
		return $this->message_tags;
	}

	/**
	 * Gets the recipeint handler function.
	 *
	 * @param strin $id The handler ID.
	 *
	 * @return callable
	 */
	public function get_recipient_handler( $id ) {
		return $this->recipients_handler[ $id ];
	}

	/**
	 * @return array
	 */
	public function get_message_actions() {
		return $this->message_actions;
	}

	/**
	 * Gets the Event UI object.
	 *
	 * @return UI
	 */
	public function get_ui() {
		return $this->ui;
	}
}
