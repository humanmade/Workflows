<?php
/**
 * Event class
 *
 * This is a class that defines an event handler, its available actions and recipient callbacks, and its UI.
 *
 * @link    https://github.com/humanmade/Workflow/issues/1
 *
 * @package HM\Workflow
 * @since   0.1.0
 */

namespace HM\Workflows;

/**
 * Class Event
 */
class Event {
	/**
	 * Event object identifier.
	 *
	 * @var string
	 */
	protected $id;

	/**
	 * Events array.
	 *
	 * @var array
	 */
	protected static $instances = [];

	/**
	 * The registered event listener.
	 *
	 * @var string|array|callable
	 */
	protected $listener;

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
	 * @return Event
	 */
	public static function register( string $id ): Event {
		$event                  = new self( $id );
		self::$instances[ $id ] = $event;

		return $event;
	}

	/**
	 * Gets an Event from the collection by ID.
	 *
	 * @param string $id Event ID.
	 *
	 * @return Event|null
	 */
	public static function get( string $id ) {
		return self::$instances[ $id ] ?? null;
	}


	/**
	 * Gets all Events from the collection..
	 *
	 * @return Event[]
	 */
	public static function get_all() {
		return self::$instances;
	}

	/**
	 * Remove an existing Event object.
	 *
	 * @param string $id
	 */
	public static function remove( string $id ) {
		unset( self::$instances[ $id ] );
	}

	/**
	 * Event constructor.
	 *
	 * @param string $id Event ID.
	 */
	protected function __construct( string $id ) {
		$this->id = $id;
	}

	/**
	 * Adds a listener.
	 *
	 * @param string|array|callable $action The action to listen on.
	 *
	 * @return Event
	 */
	public function set_listener( $action ) {
		// Sanitize and set defaults for an array type action.
		if ( is_array( $action ) ) {
			if ( ! isset( $action['action'] ) || ! is_string( $action['action'] ) ) {
				trigger_error( '`action` is a required key and must be a string when adding an event listener array.', E_USER_WARNING );

				return $this;
			}

			$action = wp_parse_args( $action, [
				'priority'      => 10,
				'accepted_args' => 1,
			] );

			$action['priority']      = intval( $action['priority'] );
			$action['accepted_args'] = intval( $action['accepted_args'] );
		}

		$this->listener = $action;

		return $this;
	}

	/**
	 * Adds the message tags.
	 *
	 * @param array $tags Array of key/value pairs.
	 *
	 * @return Event
	 */
	public function add_message_tags( array $tags ): Event {
		$this->message_tags = array_merge( $this->message_tags, $tags );

		return $this;
	}

	/**
	 * Adds a message action.
	 *
	 * @param string          $id              A reference name for the action.
	 * @param string          $text            The link or button text for the action.
	 * @param string|callable $callback_or_url A handler for when the action is clicked or a URL to send users to
	 *                                         directly.
	 * @param null|callable   $args            An optional function that receives the return value of the event action.
	 * @param array           $schema          An array of accepted $_GET arguments and their corresponding
	 *                                         sanitisation callbacks.
	 * @param array           $data            Arbitrary data passed to the Destination via $messages to any other
	 *                                         action data such as type.
	 *
	 * @return Event
	 */
	public function add_message_action( string $id, string $text, $callback_or_url, $args = null, array $schema = [], array $data = [] ): Event {
		$this->message_actions[ $id ] = [
			'text'            => $text,
			'callback_or_url' => $callback_or_url,
			'args'            => $args,
			'schema'          => $schema,
			'data'            => $data,
		];

		return $this;
	}

	/**
	 * This method should add the $name and $callback parameter to $this->recipient_handlers with $id as the key.
	 *
	 * @param string   $id       An identifier for the recipient handler to be used in the WorkFlow()->who() method.
	 * @param callable $callback This receives the event action value as it’s 1st parameter and should return one or an
	 *                           array of email addresses, user objects, user IDs or user roles.
	 * @param string   $name     A nice name to be shown in the UI, optional.
	 *
	 * @return Event
	 */
	public function add_recipient_handler( string $id, callable $callback, string $name = '' ): Event {
		$this->recipients_handlers[ $id ] = [
			'name'     => $name,
			'callback' => $callback,
		];

		return $this;
	}

	/**
	 * Set the $this->ui property to the UI object.
	 *
	 * @param string|UI $ui A nice name to show in the UI or a UI object.
	 *
	 * @return Event
	 */
	public function add_ui( $ui ): Event {
		if ( is_string( $ui ) ) {
			$this->ui = UI::register( $ui );
		}

		if ( ! $this->ui instanceof UI ) {
			return $this;
		}

		return $this;
	}

	/**
	 * Gets the Event ID.
	 *
	 * @return string
	 */
	public function get_id(): string {
		return $this->id;
	}

	/**
	 * Gets the Event listener.
	 *
	 * @return mixed
	 */
	public function get_listener() {
		if ( ! $this->listener ) {
			$this->set_listener( $this->id );
		}

		return $this->listener;
	}

	/**
	 * Gets the message tags.
	 *
	 * @return array
	 */
	public function get_message_tags(): array {
		return $this->message_tags;
	}

	/**
	 * Gets the recipient handler function.
	 *
	 * @param string $id The handler ID.
	 *
	 * @return callable|null
	 */
	public function get_recipient_handler( string $id ) {
		return $this->recipients_handlers[ $id ]['callback'] ?? null;
	}

	/**
	 * Gets the recipient handler functions.
	 *
	 * @return array
	 */
	public function get_recipient_handlers(): array {
		return $this->recipients_handlers;
	}

	/**
	 * Gets the message actions.
	 *
	 * @return array
	 */
	public function get_message_actions(): array {
		return $this->message_actions;
	}

	/**
	 * Gets the message actions.
	 *
	 * @return array|null
	 */
	public function get_message_action( string $id ): array {
		return $this->message_actions[ $id ] ?? null;
	}

	/**
	 * Gets the Event UI object.
	 *
	 * @return UI|null
	 */
	public function get_ui() {
		return $this->ui;
	}
}
