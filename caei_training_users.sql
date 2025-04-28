-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: caei_training
-- ------------------------------------------------------
-- Server version	8.0.41

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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','apprenant','formateur','agent') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (20,'nabil kouki','nabil.k23@gmail.com','$2a$10$fW4U42FMJHGyfGOzrohkAuJdbYUxE0tFAyTESnMTzoxMyPTPiE91O','apprenant'),(23,'admin','admin@gmail.com','$2a$10$QRVSqoj7Iqnb64ImqyH39ukDCb94UHkHVOrGErm1HBe.stkEIV92.','admin'),(25,'Mejd Jawadi','mejd.j19@gmail.com','$2a$10$ZPeZ6rHdJmNB52170qP4E.gKMq2TFqx0AIT95/OzTMiecAxVM3jIu','agent'),(29,'nadhir','mohmaed.n24@gmail.com','$2a$10$Xs3m5xvgVNN/hoT1IuBP0.KJclUaFSelGmeMH9ATf8K3aijrEo.pO','apprenant'),(30,'test','test@gmail.com','$2a$10$SHasZq3gukbHzERx3o5pku1i3D7xR5/GslVqax1KQTYxf5UdzzZAe','apprenant'),(31,'Si mabrouk','youssefmabrouk@gmail.com','$2a$10$U34ggq3taiqFGumMtv3j6OKC80CI7aKjDflgFy8fCpVd1hJ/TrCwy','apprenant'),(32,'will smith','willsmith@gmail.com','$2a$10$QojSbvjDNMgrYIZ6ddllyeI9SjoVb.W4m0Rmf6Ek3iE6XaEQnU26e','apprenant'),(33,'hamdi baccar','hamdi@gmail.com','$2a$10$/j391/mQTWblBtg31SmOQO3HQd9vklSp4hBtPqrw7aiPPrYO.lqVK','apprenant'),(34,'form','form@gmail.com','$2a$10$O/lKTqd9RtK4bURCn9bs1uFIlpWTfGj.9HbkqiwW3i.sXt6ahZ4kO','formateur'),(35,'client name','client@gmail.com','$2a$10$pe4lC4u3CCFaeBJyKg/e4OtoGotc/eUQDImKtoq/WimTpN/QR7zEW','apprenant'),(38,'hiba','hiba@gmail.com','$2a$10$PuoMq7PdSDvNVlANpux3WOWP4D33Rf9bT8hKKntxu2xduflVFSC1e','apprenant'),(39,'mohamed nadhir','mohanadhir@gmail.com','$2a$10$CIFAzev9Vh8U7k1HdVsOIuHTvkDeJ/bLpeb4Re4o17oO7yzsSCS1O','apprenant'),(40,'ala chouaya','ala@gmail.com','$2a$10$WodgP3qasPfFZjm7bauTp.ozaUMZxZA5YPOUt4xwVGH57LC3kKoFe','apprenant'),(42,'karim','karim@gmail.com','$2a$10$suHT10Z4bFE1jKaEuSrW9uUCIp1UJyYm/k/Wv7OUj6q6jx6xQkHeq','apprenant'),(43,'sirine nasri','sirine@gmail.com','$2a$10$MU9FIJtnJfy9FynTtyUb5.aER08Q8liMWu08tiYwWlmAIXsNkrE/2','apprenant'),(46,'Mouhanned Jawadi','mouhanned.j18@gmail.com','$2a$10$NO/lPJn7sp/WMtjHy5igoutndJ.5xuwAxdF0PvbIK964.bEwcAn8C','apprenant'),(49,'agent','agent@gmail.com','$2a$10$CQrVB2hHYBt7yR1hADDBnu8jnzk2HwkPgH9F.jVIdwOgLtTkV0hrO','agent'),(50,'Anas Raoueni','anasraoueni@gmail.com','$2a$10$2qgnRrsyQDt6azxpbFnvSOn49hyoeJ4yEJjLt8O.iI7zb5MjLnysq','formateur'),(51,'firas talbi','firas@gmail.com','$2a$10$51aqDF2IqabUgZqjf6nNMObydAwI8kQVjobAqlIObuTcTeLnNjOPG','apprenant'),(52,'hana','hana@gmail.com','$2a$10$0h/gpPNsIdGDjIRAEavnPOEMYGHBZxD2Jh73tIu.WVai/txaakCZm','apprenant'),(53,'syrta ','syrta@gmail.com','$2a$10$FLcpQNPxetSYYMrZkMkPbe69K4oGj77mhKed/VXdBt/ZTs4SkRbiK','apprenant');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-21 15:19:57
