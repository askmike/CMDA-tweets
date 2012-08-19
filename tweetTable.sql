-- phpMyAdmin SQL Dump
-- version 3.5.0
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 19, 2012 at 06:07 PM
-- Server version: 5.0.67-community
-- PHP Version: 5.2.17

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

SET time_zone = "+00:00";

-- --------------------------------------------------------

--
-- Table structure for table `tweets`
--

CREATE TABLE IF NOT EXISTS `tweets` (
  `id` int(11) NOT NULL auto_increment,
  `tweetID` bigint(20) NOT NULL,
  `timestamp` int(11) NOT NULL,
  `body` text NOT NULL,
  `source` text NOT NULL,
  `userID` bigint(20) NOT NULL,
  `userName` text NOT NULL,
  `fullName` text NOT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `tweetID` (`tweetID`),
  KEY `timestamp` (`timestamp`),
  KEY `userID` (`userID`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=14 ;
