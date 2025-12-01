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
-- Table structure for table `movie`
--

DROP TABLE IF EXISTS `movie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movie` (
  `movieID` char(6) NOT NULL,
  `movieName` varchar(50) NOT NULL,
  `movieTime` time NOT NULL,
  `ratedID` char(6) NOT NULL,
  `movieStartDate` date NOT NULL,
  `movieInfo` varchar(2000) NOT NULL,
  `moviePhoto` varchar(50) NOT NULL,
  `director` varchar(50) NOT NULL,
  `actors` varchar(1000) NOT NULL,
  PRIMARY KEY (`movieID`),
  KEY `fk_movie_rated` (`ratedID`),
  CONSTRAINT `fk_movie_rated` FOREIGN KEY (`ratedID`) REFERENCES `rated` (`ratedID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movie`
--

LOCK TABLES `movie` WRITE;
/*!40000 ALTER TABLE `movie` DISABLE KEYS */;
INSERT INTO `movie` VALUES ('D00001','星際漫遊記','02:35:00','R00003','2024-12-01','一部史詩級科幻冒險電影','/movie/star.jpg','李安','張震, 舒淇'),('D00002','恐怖小屋','01:45:00','R00001','2024-11-20','年度最駭人聽聞的驚悚片','/movie/horror.jpg','溫子仁','林心如, 許光漢'),('D00003','愛情習題','02:00:00','R00004','2025-01-05','清新的校園愛情故事','/movie/love.jpg','九把刀','柯震東, 宋芸樺'),('D00004','超能戰士','02:10:00','R00002','2024-12-15','超級英雄激戰大反派','/movie/hero.jpg','克里斯多福諾蘭','湯姆克魯斯, 蓋兒加朵'),('D00005','美食之旅','01:30:00','R00004','2025-02-10','紀錄片，尋找隱藏在街頭的美食','/movie/food.jpg','是枝裕和','劉德華');
/*!40000 ALTER TABLE `movie` ENABLE KEYS */;
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
