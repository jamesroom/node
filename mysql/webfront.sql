-- phpMyAdmin SQL Dump
-- version 4.0.6deb1
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2014-01-06 17:14:40
-- 服务器版本: 5.5.34-0ubuntu0.13.10.1
-- PHP 版本: 5.5.3-1ubuntu2.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `webfront`
--

-- --------------------------------------------------------

--
-- 表的结构 `tpl_api`
--

CREATE TABLE IF NOT EXISTS `tpl_api` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `name` varchar(200) NOT NULL,
  `source` varchar(200) NOT NULL,
  `example` text NOT NULL,
  `type` int(11) NOT NULL,
  `insert_row_time` int(11) NOT NULL,
  `update_row_time` int(11) NOT NULL,
  `query_num` int(11) NOT NULL,
  `query_key` varchar(200) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `tpl_api`
--

INSERT INTO `tpl_api` (`uid`, `user_id`, `title`, `name`, `source`, `example`, `type`, `insert_row_time`, `update_row_time`, `query_num`, `query_key`) VALUES
(1, 1, 'api mysql test', 'api mysql testapi mysql test', 'http://www.baidu.com/resourse.js', 'http://www.baidu.com/resourse.jshttp://www.baidu.com/resourse.jshttp://www.baidu.com/resourse.jshttp://www.baidu.com/resourse.jshttp://www.baidu.com/resourse.js', 1, 111111, 111111, 4, 'baidu,lunjiang');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;