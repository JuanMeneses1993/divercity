-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 12, 2022 at 12:11 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `restapi_nodejs_express`
--

-- --------------------------------------------------------

--
-- Table structure for table `clientes`
--

CREATE TABLE `clientes` (
  `id` tinyint(2) NOT NULL,
  `user` varchar(20) NOT NULL,
  `pass` varchar(30) NOT NULL,
  `leftMinutes` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `clientes`
--

INSERT INTO `clientes` (`id`, `user`, `pass`, `leftMinutes`) VALUES
(4, 'pepito', 'pepito123', '179'),
(12, 'juancarlos', 'Juanito', '0'),
(13, 'juanito', 'Juanito123', '556'),
(14, 'pepitos', 'Pepitos1234', '240'),
(15, 'juan', 'aaaaaaaa', '300'),
(16, 'pepita', 'asdfasdf', '120'),
(17, 'pepita2', 'asdfasdf', '0'),
(18, 'pepita4', 'asdfasdf', '210');

-- --------------------------------------------------------

--
-- Table structure for table `empleados`
--

CREATE TABLE `empleados` (
  `id` tinyint(2) NOT NULL,
  `userName` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `isActive` varchar(15) NOT NULL,
  `totalMinutesSold` varchar(10) NOT NULL,
  `MinutesSoldToday` varchar(10) NOT NULL,
  `MinutesSoldThisMonth` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `empleados`
--

INSERT INTO `empleados` (`id`, `userName`, `password`, `isActive`, `totalMinutesSold`, `MinutesSoldToday`, `MinutesSoldThisMonth`) VALUES
(1, 'Juanito', '', 'administrador', 'Lalala', '0', '');

-- --------------------------------------------------------

--
-- Table structure for table `historial`
--

CREATE TABLE `historial` (
  `id` int(10) NOT NULL,
  `tvNumber` varchar(2) NOT NULL,
  `mode` varchar(12) NOT NULL,
  `timeActive` varchar(30) NOT NULL,
  `clientName` varchar(30) NOT NULL,
  `employeeName` varchar(20) NOT NULL,
  `date` varchar(20) NOT NULL,
  `time` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `historial`
--

INSERT INTO `historial` (`id`, `tvNumber`, `mode`, `timeActive`, `clientName`, `employeeName`, `date`, `time`) VALUES
(238, '3', 'active', '00:30:00', 'Anonymous', 'juanad', '2022-11-11', '05:25:17+00:00'),
(239, '3', 'active', '00:30:00', 'Anonymous', 'juanad', '2022-11-11', '05:22:17+00:00'),
(240, '3', 'active', '00:30:00', 'Anonymous', 'juanad', '2022-10-10', '05:22:17+00:00'),
(241, '5', 'active', '00:03:00', 'Anonymous', 'juanad', '2022-11-11', '05:37:51+00:00'),
(242, '2', 'active', '00:04:00', 'Anonymous', 'juanad', '2022-11-11', '05:37:54+00:00'),
(243, '1', 'active', '00:03:00', 'Anonymous', 'juanad', '2022-11-11', '05:38:00+00:00'),
(244, '6', 'active', '00:06:00', 'Anonymous', 'juanad', '2022-11-11', '05:41:10+00:00'),
(245, '2', 'active', '00:06:00', 'Anonymous', 'juanad', '2022-11-11', '05:46:28+00:00'),
(246, '4', 'active', '00:30:00', 'Anonymous', 'juanad', '2022-11-11', '06:01:54+00:00'),
(247, '3', 'active', '00:30:00', 'Anonymous', 'juanad', '2022-11-11', '06:03:45+00:00'),
(248, '7', 'active', '00:30:00', 'Anonymous', 'juanad', '2022-11-11', '06:07:16+00:00'),
(249, '1', 'active', '00:30:00', 'Anonymous', 'juanad', '2022-11-11', '06:10:37+00:00'),
(250, '5', 'active', '02:00:00', 'Anonymous', 'juanad', '2022-11-11', '07:42:34+00:00'),
(251, '1', 'active', '00:01:00', 'Anonymous', 'juanadmin', '2022-11-11', '08:16:13+00:00'),
(252, '4', 'active', '00:05:00', 'Anonymous', 'juanadmin', '2022-11-11', '08:33:39+00:00'),
(253, '1', 'active', '00:30:00', 'juanito', 'juan', '2022-11-11', '09:01:44+00:00'),
(254, '9', 'active', '05:00:00', 'Anonymous', 'juanad', '2022-11-11', '10:42:46+00:00'),
(255, '2', 'active', '02:00:00', 'Anonymous', 'juan', '2022-11-11', '13:12:58+00:00'),
(256, '8', 'active', '08:00:00', 'Anonymous', 'juanad', '2022-11-11', '13:42:41+00:00');

-- --------------------------------------------------------

--
-- Table structure for table `maquinas`
--

CREATE TABLE `maquinas` (
  `id` tinyint(3) NOT NULL,
  `isActive` float NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `minutes_bought` tinyint(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

CREATE TABLE `session` (
  `sessionId` int(11) NOT NULL,
  `startTime` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tvs`
--

CREATE TABLE `tvs` (
  `tvNumber` varchar(2) NOT NULL,
  `currentUser` varchar(30) NOT NULL,
  `state` varchar(20) NOT NULL DEFAULT 'inactive',
  `minutesBrough` varchar(10) NOT NULL,
  `startTime` varchar(40) NOT NULL,
  `endTime` varchar(40) NOT NULL,
  `endTimeMinusFiveMin` varchar(30) NOT NULL,
  `employeeName` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tvs`
--

INSERT INTO `tvs` (`tvNumber`, `currentUser`, `state`, `minutesBrough`, `startTime`, `endTime`, `endTimeMinusFiveMin`, `employeeName`) VALUES
('1', 'null', 'inactive', '0', 'null', 'null', 'null', 'juan'),
('10', 'null', 'inactive', '0', 'null', 'null', 'null', 'juan'),
('2', 'null', 'inactive', '0', 'null', 'null', 'null', 'juan'),
('3', 'null', 'inactive', '0', 'null', 'null', 'null', 'juanad'),
('4', 'null', 'inactive', '0', 'null', 'null', 'null', 'juanadmin'),
('5', 'null', 'inactive', '0', 'null', 'null', 'null', 'juanad'),
('6', 'null', 'inactive', '0', 'null', 'null', 'null', 'juanad'),
('7', 'null', 'inactive', '0', 'null', 'null', 'null', 'juanad'),
('8', 'null', 'inactive', '0', 'null', 'null', 'null', 'juanad'),
('9', 'null', 'inactive', '0', 'null', 'null', 'null', 'juanad');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `user` varchar(30) NOT NULL,
  `pass` varchar(30) NOT NULL,
  `role` varchar(8) NOT NULL,
  `lastLogin` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `user`, `pass`, `role`, `lastLogin`) VALUES
(1, 'juan', 'juan', 'employee', 'null'),
(2, 'juanadmin', 'juan', 'admin', 'null'),
(6, 'juanad', 'juan', 'admin', 'null');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `empleados`
--
ALTER TABLE `empleados`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `historial`
--
ALTER TABLE `historial`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `maquinas`
--
ALTER TABLE `maquinas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tvs`
--
ALTER TABLE `tvs`
  ADD PRIMARY KEY (`tvNumber`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` tinyint(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `empleados`
--
ALTER TABLE `empleados`
  MODIFY `id` tinyint(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `historial`
--
ALTER TABLE `historial`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=257;

--
-- AUTO_INCREMENT for table `maquinas`
--
ALTER TABLE `maquinas`
  MODIFY `id` tinyint(3) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
