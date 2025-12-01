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
-- Table structure for table `showing`
--

DROP TABLE IF EXISTS `showing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `showing` (
  `showingID` char(6) NOT NULL,
  `movieID` char(6) NOT NULL,
  `theaterID` char(6) NOT NULL,
  `versionID` char(6) NOT NULL,
  `showingTime` datetime NOT NULL,
  PRIMARY KEY (`showingID`),
  KEY `fk_showing_movie` (`movieID`),
  KEY `fk_showing_theater` (`theaterID`),
  KEY `fk_showing_version` (`versionID`),
  CONSTRAINT `fk_showing_movie` FOREIGN KEY (`movieID`) REFERENCES `movie` (`movieID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_showing_theater` FOREIGN KEY (`theaterID`) REFERENCES `theater` (`theaterID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_showing_version` FOREIGN KEY (`versionID`) REFERENCES `version` (`versionID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `showing`
--

LOCK TABLES `showing` WRITE;
/*!40000 ALTER TABLE `showing` DISABLE KEYS */;
INSERT INTO `showing` VALUES ('S00001','D00001','H00001','V00001','2025-12-05 14:30:00'),('S00002','D00002','H00002','V00003','2025-12-05 18:00:00'),('S00003','D00003','H00003','V00005','2025-12-06 10:00:00'),('S00004','D00004','H00004','V00002','2025-12-06 20:30:00'),('S00005','D00001','H00005','V00004','2025-12-07 16:45:00');
/*!40000 ALTER TABLE `showing` ENABLE KEYS */;
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
