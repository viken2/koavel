CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL DEFAULT '',
  `email` varchar(100) NOT NULL DEFAULT '',
  `password` varchar(64) NOT NULL,
  `phone` varchar(20) NOT NULL DEFAULT '',
  `true_name` varchar(20) NOT NULL DEFAULT '',
  `description` varchar(200) NOT NULL,
  `login_ip` varchar(20) NOT NULL DEFAULT '',
  `status` tinyint(4) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;