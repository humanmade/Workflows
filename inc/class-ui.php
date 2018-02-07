<?php
/**
 * Created by PhpStorm.
 * User: paul
 * Date: 07/02/2018
 * Time: 11:52
 */

namespace HM\Workflow;

/**
 * Class UI
 * @package HM\Workflow
 */
class UI {
	/**
	 * @var
	 */
	protected $name;

	/**
	 * @var
	 */
	protected $fields;

	/**
	 * @var
	 */
	protected $description;

	/**
	 * @var
	 */
	protected $key;

	/**
	 * @var
	 */
	protected $instances;

	/**
	 * UI constructor.
	 *
	 * @param $name
	 */
	public function __construct( $name ) {
		$this->name = $name;
		$this->set_key( sanitize_key( $name ) );
	}

	/**
	 * @param $key
	 *
	 * @return mixed
	 */
	public function set_key( $key ) {
		$this->key = $key;

		return self;
	}

	/**
	 * @param $description
	 *
	 * @return mixed
	 */
	public function set_description( $description ) {
		$this->description = $description;

		return self;
	}

	/**
	 * @param $name
	 * @param $label
	 * @param $type
	 * @param $params
	 *
	 * @return mixed
	 */
	public function add_field( $name, $label, $type, $params ) {
		$this->fields[] = [
			'name'   => $name,
			'label'  => $label,
			'type'   => $type,
			'params' => $params,
			'value'  => $this->get_data(),
		];

		return self;
	}

	/**
	 * @param $data
	 */
	public function save_data( $data ) {
		// return update_post_meta()
	}

	/**
	 * @return mixed
	 */
	public function get_data() {
		return get_post_meta();
	}

	/**
	 * @return array
	 */
	public function get_config() {
		return [];
	}
}
