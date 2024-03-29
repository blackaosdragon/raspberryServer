CREATE TABLE `test`.`Valores` ( `registro` INT NOT NULL AUTO_INCREMENT , `lugar` VARCHAR(50) NOT NULL , `valor` FLOAT(5) NOT NULL , `fecha` TIMESTAMP NOT NULL , PRIMARY KEY (`registro`)) ENGINE = InnoDB;
INSERT INTO `Valores` (`registro`, `lugar`, `valor`, `fecha`) VALUES (NULL, 'Oficina', '5.6', CURRENT_TIMESTAMP);
Listar los nombres de una tabla
-  SELECT column_name FROM information_schema.columns WHERE table_name="Registro";
-  SELECT clomun_name FROM information_schema.columns WHERE table_name="Nombre_de_tu_tabla";

SELECT table_schema, TABLE_NAME, ROUND(((data_length + index_length) / 1024 / 1024), 2) `Tamaño(MB)`  FROM information_schema.TABLES WHERE TABLE_NAME='Registro';
SELECT DISTINCT (extract(year FROM fecha)) AS año FROM Registro;
Obtener los dias
-  SELECT DISTINCT (extract(day FROM fecha)) AS dia FROM monitoreo.Registro WHERE fecha>= '2020-05-01' AND fecha<'2020-05-31';
-  SELECT DISTINCT ubicacion AS lugar FROM monitoreo.Registro;

Crear Tabla nueva 
 - CREATE TABLE `test`.`pruebaFechas` ( `Lugar` VARCHAR(30) NOT NULL , `Temperatura` FLOAT(6) NOT NULL , `Dia` INT(2) NOT NULL , `Mes` INT(2) NOT NULL , `Año` INT(4) NOT NULL , `Hora` INT(2) NOT NULL , `Minuto` INT(2) NOT NULL , `Segundo` INT(2) NOT NULL , `Ubicacion` VARCHAR(30) NOT NULL , `Marca` VARCHAR(30) NULL , `Modelo` VARCHAR(30) NULL , `Serie` VARCHAR(30) NULL , `Inventario` VARCHAR(30) NULL , `ID` INT NOT NULL AUTO_INCREMENT ) `Mes` INT(2) NOT NULL
 - CREATE TABLE `test`.`pruebaFechas` ( `Lugar` VARCHAR(30) NOT NULL , `Temperatura` FLOAT(6) NOT NULL , `Dia` INT(2) NOT NULL , `Mes` INT(2) NOT NULL , `Año` INT(4) NOT NULL , `Hora` INT(2) NOT NULL , `Minuto` INT(2) NOT NULL , `Segundo` INT(2) NOT NULL , `Ubicacion` VARCHAR(30) NOT NULL , `Marca` VARCHAR(30) NULL , `Modelo` VARCHAR(30) NULL , `Serie` VARCHAR(30) NULL , `Inventario` VARCHAR(30) NULL , `ID` INT NOT NULL , PRIMARY KEY (`ID`)) ENGINE = InnoDB;
 - CREATE TABLE monitoreo.Bitacora ( `Lugar` VARCHAR(30) NOT NULL , `Temperatura` FLOAT(6) NOT NULL , `Dia` INT(2) NOT NULL , `Mes` INT(2) NOT NULL , `Año` INT(4) NOT NULL , `Hora` INT(2) NOT NULL , `Minuto` INT(2) NOT NULL , `Segundo` INT(2) NOT NULL , `ID` INT NOT NULL);

 `Ubicacion` VARCHAR(30) NOT NULL , `Marca` VARCHAR(30) NULL , `Modelo` VARCHAR(30) NULL , `Serie` VARCHAR(30) NULL , `Inventario` VARCHAR(30) NULL , 
 INSERT INTO monitoreo.Bitacora(Lugar, Temperatura, Dia, Mes, Año, Hora, Minuto, Segundo,ID) VALUES ("oficina",21.5,26,06,2020,9,40,0,2);


 Insertar Data
 - INSERT INTO `pruebaFechas`(`Lugar`, `Temperatura`, `Dia`, `Mes`, `Año`, `Hora`, `Minuto`, `Segundo`, `Ubicacion`, `Marca`, `Modelo`, `Serie`, `Inventario`) VALUES ("oficina",21.5,25,06,2020,11,10,0,"Plata Baja","Sin marca",NULL,"101010","imss2020pbST1")
 - INSERT INTO monitoreo.equipos (Nombre,Marca,Modelo,Serie,Inventario,Unidad,Abreviado,Ubicacion,Contrato,Identificador) VALUES ('Cámara Farmacia',)
 INSERT INTO monitoreo.dalyData (Lugar,Temperatura,Dia,Mes,Año,Hora,Minuto,Segundo,ID,Ubicacion) VALUES ()
 INSERT INTO monitoreo.dalyData (Lugar,Temperatura,Dia,Mes,Año,Hora,Minuto,Segundo,ID,Ubicacion) VALUES ('Cámara farmacia',4.78,27,02,2021,8,60,60,2,'H. Cardiología S. XXI');


Otorgar Permisos
 - GRANT SELECT on monitoreo.test to 'infoUpdater'@'localhost';

MOstrar todas las tablas de un base de datos
 - SHOW FULL TABLES from base_De_Datos;

Mostrar los Permisos de un usuario
 - SHOW GRANTS FOR 'infoUpdater'@'localhost'; 

Obtener los tipos de datos en una tabla:
 - DESCRIBE monitoreo.test;

Exportacion de una base de datos
 - sudo mysqldump -u root -p monitoreo > monitoreoBackup.sql

Importacion de una base de datos
 - si salta error al importar #1273 por utf8mb4_0900_ai_ci sustituir por => utf8mb4_unicode_ci

Agregar una nueva columna a una tabla
 - ALTER TABLE monitoreo.camas add(`equipo_abrev` varchar(10) null,`unidad_abrev` varchar(15) null);




SELECT EXTRACT(year FROM fecha) year FROM monitoreo.Registro;

SELECT EXTRACT(year FROM fecha) year FROM Registro;
SELECT fecha as año WHERE 
SELECT count(distinct year) from Registro;
SELECT count(distinct fecha) from Registro;
SELECT EXTRACT(year FROM fecha) 
SELECT COUNT (DISTINCT fecha) FROM Registro;
SELECT COUNT(DISTINCT (EXTRACT (year FROM fecha))) FROM Registro;


SELECT * FROM monitoreo.Bitacora 
WHERE 
año=(SELECT MAX(Año) FROM monitoreo.Bitacora WHERE ID=1) AND 
Mes=(SELECT MAX(Mes) FROM monitoreo.Bitacora WHERE ID=1) AND 
Dia=(SELECT MAX(Dia) FROM monitoreo.Bitacora WHERE ID=1) AND 
Hora=(SELECT MAX(Hora) FROM monitoreo.Bitacora WHERE ID=1) AND 
Minuto=(SELECT MAX(Minuto) FROM monitoreo.Bitacora WHERE ID=1;

SELECT * FROM monitoreo.Bitacora WHERE año=(SELECT MAX(Año) FROM monitoreo.Bitacora WHERE ID=1) AND Mes=(SELECT MAX(Mes) FROM monitoreo.Bitacora WHERE ID=1) AND Dia=(SELECT MAX(Dia) FROM monitoreo.Bitacora WHERE ID=1) AND Hora=(SELECT MAX(Hora) FROM monitoreo.Bitacora WHERE ID=1) AND Minuto=(SELECT MAX(Minuto) FROM monitoreo.Bitacora WHERE ID=1;

SELECT * FROM monitoreo.Bitacora 
  WHERE año=(SELECT MAX(Año) FROM monitoreo.Bitacora WHERE ID=1) AND
  Mes=(SELECT MAX(Mes) FROM monitoreo.Bitacora WHERE ID=1) and 
  Dia=(SELECT MAX(Dia) FROM monitoreo.Bitacora WHERE ID=1) AND 
  Hora=(SELECT MAX(Hora) FROM monitoreo.Bitacora WHERE ID=1) AND 
  Minuto=(SELECT MAX(Minuto) FROM monitoreo.Bitacora WHERE ID=1;
  Hora=(SELECT MAX(Hora) FROM monitoreo.Bitacora WHERE id=1));

  SELECT * FROM monitoreo.Bitacora WHERE año=(SELECT MAX(Año) FROM monitoreo.Bitacora WHERE ID=1) AND Mes=(SELECT MAX(Mes) FROM monitoreo.Bitacora WHERE ID=1) and Dia=(SELECT MAX(Dia) FROM monitoreo.Bitacora WHERE ID=1) AND Hora=(SELECT MAX(Hora) FROM monitoreo.Bitacora WHERE ID=1) AND Minuto=(SELECT MAX(Minuto) FROM monitoreo.Bitacora WHERE ID=1;

  SELECT * FROM monitoreo.Bitacora 
    WHERE año=(SELECT MAX(Año) FROM monitoreo.Bitacora WHERE ID=1) AND 
    Mes=(SELECT MAX(Mes) FROM monitoreo.Bitacora WHERE ID=1) AND 
    Dia=(SELECT MAX(Dia) FROM monitoreo.Bitacora WHERE ID=1) AND 
    Hora=(SELECT MAX(Hora) FROM monitoreo.Bitacora WHERE ID=1) AND 
      Minuto=
      (SELECT MAX(Minuto) FROM monitoreo.Bitacora WHERE ID=1 AND Hora=(SELECT MAX(Hora) FROM monitoreo.Bitacora WHERE ID=1));

  Base de datos equipos en general:
  CREATE TABLE `Instrumentacion`.`RedFria` ( `id` INT NOT NULL AUTO_INCREMENT , `ubicacion` VARCHAR(100) NOT NULL , `equipo` VARCHAR(50) NOT NULL , `marca` VARCHAR(30) NULL , `modelo` VARCHAR(50) NULL , `serie` VARCHAR(50) NULL , `inventario` VARCHAR(50) NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;
  SensorPresion= analogRead(sensor);
  PresionVolts= SensorPresion* 5;
  PresionBytes= PresionVolts/1023;  
  PresMegaPasExt = ((PresionBytes/3.75)-0.1);
  PresKiloPasExt = (PresMegaPasExt*1000);
  PresionExt = (PresKiloPasExt/6.895)-4.4;
  PresionReal= (PresionExt*0.183)+(PresionExt);

  INSERT INTO monitoreo.Bitacora(Lugar, Temperatura, Dia, Mes, Año, Hora, Minuto, Segundo,ID) VALUES ("Cámara farmacia",6.5, 14,10,2020,10,0,5,1);


