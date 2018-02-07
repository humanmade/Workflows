<?php
/**
 * Created by PhpStorm.
 * User: paul
 * Date: 07/02/2018
 * Time: 11:02
 */

namespace HM\Workflow;

/**
 * Class Event
 * @package HM\Workflow
 */
class Event {

	/**
	 * @var
	 */
	protected static $events;

	/**
	 * @var
	 */
	protected $listeners;

	/**
	 * @var
	 */
	protected $message_tags;

	/**
	 * @var
	 */
	protected $message_actions;

	/**
	 * @var
	 */
	protected $recipients_handlers;

	/**
	 * @var
	 */
	protected $ui;

	/**
	 * @var
	 */
	protected $name;

	/**
	 * @param $id
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
	 * @param $action
	 *
	 * @return mixed
	 */
	public function add_listener( $action ) {
		return $this;
	}

	/**
	 * @param $tags
	 *
	 * @return mixed
	 */
	public function add_message_tags( $tags ) {
		return $this;
	}

	/**
	 * @param $id
	 * @param $text
	 * @param $callback_or_url
	 * @param $args
	 *
	 * @return mixed
	 */
	public function add_message_action( $id, $text, $callback_or_url, $args ) {
		return $this;
	}

	/**
	 * @param $ui
	 *
	 * @return mixed
	 */
	public function add_ui( $ui ) {
		if ( is_string( $ui ) ) {
			$this->ui = new UI( $ui );
		}
		return $this;
	}

	/**
	 * @param $id
	 *
	 * @return mixed
	 */
	public static function get( $id ) {
		return self::$events[ $id ];
	}

	/**
	 * @return mixed
	 */
	public function get_listeners() {
		return $this->listeners;
	}

	/**
	 * @return mixed
	 */
	public function get_message_tags() {
		return $this->message_tags;
	}

	/**
	 * @param $id
	 *
	 * @return mixed
	 */
	public function get_recipient_handler( $id ) {
		return $this->recipients_handlers;
	}

	/**
	 * @return mixed
	 */
	public function get_message_actions() {
		return $this->message_actions;
	}

	/**
	 * @return mixed
	 */
	public function get_ui() {
		return $this->ui;
	}
}
