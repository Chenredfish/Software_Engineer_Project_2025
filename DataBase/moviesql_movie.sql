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
INSERT INTO `movie` VALUES ('D00001', '阿凡達', '02:42:00', 'R00003', '2009-12-18', '一個關於潘朵拉星球與人類衝突的科幻故事。', 'Photo/movie/avatar.jpg', '詹姆斯·卡麥隆', '山姆·沃辛頓, 柔伊·莎達娜'),
('D00002', '動物方城市', '01:48:00', 'R00004', '2016-03-04', '兔子茱蒂與狐狸尼克攜手破案的動畫片。', 'Photo/movie/zootopia.jpg', '拜倫·霍華德', '金妮弗·古德溫, 傑森·貝特曼'),
('D00003', '出神入化', '01:55:00', 'R00002', '2013-05-31', '四騎士利用魔術手法進行銀行劫案。', 'Photo/movie/illusion.jpg', '路易斯·賴托瑞', '傑西·艾森伯格, 馬克·盧法洛'),
('D00004', '大蟒蛇', '01:29:00', 'R00001', '1997-04-11', '一支紀錄片小組在亞馬遜叢林遭遇巨蟒。', 'Photo/movie/anaconda.jpg', '路易斯·羅沙', '珍妮弗·洛佩茲, 冰塊酷巴'),
('D00005', '魔法壞女巫', '02:30:00', 'R00003', '2024-11-27', '綠色皮膚女巫艾芙芭與白膚女巫葛琳達的友誼故事。', 'Photo/movie/wicked.jpg', '朱浩偉', '辛西婭·艾利沃, 亞莉安娜·格蘭德');
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
