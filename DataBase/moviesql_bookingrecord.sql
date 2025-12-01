-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: moviesql
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bookingrecord`
--

DROP TABLE IF EXISTS `bookingrecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookingrecord` (
  `orderID` char(6) NOT NULL,
  `ticketID` char(6) NOT NULL,
  `memberID` char(10) NOT NULL,
  `shwingID` char(6) NOT NULL,
  `orderStateID` char(6) NOT NULL,
  `mealsID` char(6) NOT NULL,
  `ticketTypeID` char(6) NOT NULL,
  `bookingTime` datetime NOT NULL,
  `seatID` char(6) NOT NULL,
  PRIMARY KEY (`orderID`,`ticketID`),
  UNIQUE KEY `ticketID` (`ticketID`),
  KEY `fk_br_member` (`memberID`),
  KEY `fk_br_orderstatus` (`orderStateID`),
  KEY `fk_br_meals` (`mealsID`),
  KEY `fk_br_ticketclass` (`ticketTypeID`),
  KEY `fk_br_seat` (`shwingID`,`seatID`),
  CONSTRAINT `fk_br_meals` FOREIGN KEY (`mealsID`) REFERENCES `meals` (`mealsID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_br_member` FOREIGN KEY (`memberID`) REFERENCES `member` (`memberID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_br_orderstatus` FOREIGN KEY (`orderStateID`) REFERENCES `orderstatus` (`orderStatusID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_br_seat` FOREIGN KEY (`shwingID`, `seatID`) REFERENCES `seat` (`showingID`, `seatNumber`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_br_showing_id` FOREIGN KEY (`shwingID`) REFERENCES `showing` (`showingID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_br_ticketclass` FOREIGN KEY (`ticketTypeID`) REFERENCES `ticketclass` (`ticketClassID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookingrecord`
--

LOCK TABLES `bookingrecord` WRITE;
/*!40000 ALTER TABLE `bookingrecord` DISABLE KEYS */;
INSERT INTO `bookingrecord` VALUES ('O10001','K1A001','A123456789','S00001','S00001','M00001','T00001','2025-12-01 10:30:00','A01'),('O10001','K1A002','A123456789','S00001','S00001','M00004','T00002','2025-12-01 10:30:00','A02'),('O10002','K2B001','B234567890','S00002','S00005','M00003','T00001','2025-12-02 12:45:00','B05'),('O10003','K3C001','C345678901','S00004','S00004','M00005','T00003','2025-12-03 09:10:00','D01'),('O10004','K4D001','D456789012','S00003','S00001','M00001','T00004','2025-12-04 15:20:00','C10');
/*!40000 ALTER TABLE `bookingrecord` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-02  0:12:32
