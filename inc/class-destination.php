<?php
/**
 * Created by PhpStorm.
 * User: paul
 * Date: 07/02/2018
 * Time: 11:22
 */

namespace HM\Workflow;

/**
 * Class Destination
 * @package HM\Workflow
 */
class Destination {
	/**
	 * @var
	 */
	protected $id;

	/**
	 * @var
	 */
	protected static $instances;

	/**
	 * @var
	 */
	protected $ui;

	/**
	 * @var
	 */
	protected $handler;

	/**
	 *
	 *
	 * @param $id
	 * @param $handler
	 */
	public static function register( $id, $handler ) {
		$destination            = new self( $id, $handler );
		self::$instances[ $id ] = $destination;
	}

	/**
	 * Destination constructor.
	 *
	 * @param $id
	 * @param $handler
	 */
	protected function __construct( $id, $handler ) {
		$this->handler = $handler;
		$this->id      = $id;
	}

	/**
	 * @param $recipients
	 * @param $messages
	 */
	public function call_handler( $recipients, $messages ) {
		$this->handler( $recipients, $messages, $this->ui->get_data() );
	}

	/**
	 * @param $ui
	 *
	 * @return mixed
	 */
	public function add_ui( $ui ) {
		$this->ui = $ui;
		return self;
	}
}
