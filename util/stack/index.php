<?php
/**
 * Created by PhpStorm.
 * User: kathleen
 * Date: 14-4-4
 * Time: 上午11:48
 */
sleep(rand(1,5));
echo json_encode(array('guid'=>$_REQUEST["guid"]));