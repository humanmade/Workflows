<?php
/**
 * Destination class.
 *
 * This class handles the list of recipients and messages and optionally allows you to specify a UI for the destination.
 *
 * @link       https://github.com/humanmade/Workflow/issues/2
 *
 * @package    WordPress
 * @subpackage Component
 * @since      0.1.0
 */

namespace HM\Workflows;

/**
 * Class Destination
 */
class Destination {
	/**
	 * Destination ID.
	 *
	 * @var string
	 */
	protected $id;

	/**
	 * Array of Destinations.
	 *
	 * @var array
	 */
	protected static $instances = [];

	/**
	 * Destination UI.
	 *
	 * @var UI
	 */
	protected $ui;

	/**
	 * Destination handler function.
	 *
	 * @var callable
	 */
	protected $handler;

	/**
	 * Registers a new Destination.
	 *
	 * @param string   $id      Destination ID.
	 * @param callable $handler Destination handler function.
	 *
	 * @return Destination
	 */
	public static function register( string $id, callable $handler ) : Destination {
		$destination            = new self( $id, $handler );
		self::$instances[ $id ] = $destination;

		return $destination;
	}

	/**
	 * Get a registered Destination by ID.
	 *
	 * @param string $id
	 * @return Destination|null
	 */
	public static function get( string $id ) {
		return self::$instances[ $id ] ?? null;
	}

	/**
	 * Get all registered Destinations.
	 *
	 * @return Destination[]
	 */
	public static function get_all() {
		return self::$instances;
	}

	/**
	 * Remove an existing Destination object.
	 *
	 * @param string $id
	 */
	public static function remove( string $id ) {
		unset( self::$instances[ $id ] );
	}

	/**
	 * Destination constructor.
	 *
	 * @param string   $id      Destination ID.
	 * @param callable $handler Destination handler function.
	 */
	protected function __construct( string $id, callable $handler ) {
		$this->handler = $handler;
		$this->id      = $id;
	}

	/**
	 * Override or set the destination handler.
	 *
	 * @param callable $handler
	 * @return $this
	 */
	public function set_handler( callable $handler ) : Destination {
		$this->handler = $handler;

		return $this;
	}

	/**
	 * Run the destination handler.
	 *
	 * @param array $recipients The recipients.
	 * @param array $message   The message to display.
	 */
	public function call_handler( array $recipients, array $message ) {
		// Filter out recipients with the notification disabled.
		$recipients = array_filter( $recipients, function ( $recipient ) {
			if ( is_a( $recipient, 'WP_User' ) ) {
				return ! get_user_meta( $recipient->ID, "hm.workflows.destinations.disable.{$this->id}", true );
			}

			return true;
		} );

		$recipients = array_unique( $recipients, SORT_REGULAR );

		$ui_data = [];

		if ( $this->get_ui() ) {
			$ui_data = $this->get_ui()->get_data();
		}

		( $this->handler )( $recipients, $message, $ui_data );
	}

	/**
	 * Add the UI object.
	 *
	 * @param UI|string $ui Destination UI.
	 *
	 * @return $this
	 */
	public function add_ui( $ui ) : Destination {
		if ( is_string( $ui ) ) {
			$this->ui = UI::register( $ui );
		}

		if ( ! $ui instanceof UI ) {
			return $this;
		}

		$this->ui = $ui;

		return $this;
	}

	/**
	 * Get the UI for the destination.
	 *
	 * @return UI|null
	 */
	public function get_ui() {
		return $this->ui;
	}
}
