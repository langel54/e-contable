# Guía Maestra: Migración Segura MariaDB a Prisma

Esta guía contiene los scripts y procesos exactos utilizados para migrar los datos históricos sin pérdida de información.

---

## 1. Renombramiento de Tablas (Preparación)
Prisma requiere nombres de tablas sin guiones bajos para coincidir con el modelo. Ejecuta este script primero.

```sql
RENAME TABLE 
    `act_especifica` TO `actespecifica`,
    `caja_anual` TO `cajaanual`,
    `caja_mes` TO `cajames`,
    `cliente_prov` TO `clienteprov`,
    `forma_pago_trib` TO `formapagotrib`,
    `tipo_documento` TO `tipodocumento`,
    `tipo_operacion` TO `tipooperacion`,
    `tipo_trib` TO `tipotrib`,
    `tipo_usuario` TO `tipousuario`;
```

---

## 2. Limpieza de Integridad (Evitar error 1452)
Antes de crear las llaves foráneas, debemos limpiar los datos "huérfanos" que rompen la integridad referencial.

```sql
-- Limpiar huérfanos en ClienteProv
UPDATE clienteprov SET nregimen = NULL WHERE nregimen NOT IN (SELECT nregimen FROM regimen);
UPDATE clienteprov SET nrubro = NULL WHERE nrubro NOT IN (SELECT nrubro FROM rubro);

-- Limpiar huérfanos en Ingreso/Salida
UPDATE ingreso SET idestado = NULL WHERE idestado NOT IN (SELECT idestado FROM estado);
UPDATE salida SET idestado = NULL WHERE idestado NOT IN (SELECT idestado FROM estado);
```

---

## 3. Sincronización Estructural (Script Completo)
Este script ajusta los índices, tipos de datos y crea las nuevas tablas de monitoreo. Es **VITAL** ejecutarlo todo.

```sql
-- A. ELIMINAR LLAVES ANTIGUAS (Nombres de PHP)
ALTER TABLE `cajames` DROP FOREIGN KEY `fk_caja_mes_caja_anual1`;
ALTER TABLE `clienteprov` DROP FOREIGN KEY `fk_cliente_prov_regimen1`;
ALTER TABLE `clienteprov` DROP FOREIGN KEY `fk_cliente_prov_rubro1`;
ALTER TABLE `ingreso` DROP FOREIGN KEY `fk_ingreso_caja_mes1`;
ALTER TABLE `ingreso` DROP FOREIGN KEY `fk_ingreso_cliente_prov1`;
ALTER TABLE `ingreso` DROP FOREIGN KEY `fk_ingreso_periodo1`;
ALTER TABLE `ingreso` DROP FOREIGN KEY `fk_operacion_concepto110`;
ALTER TABLE `ingreso` DROP FOREIGN KEY `fk_operacion_tipo_documento110`;
ALTER TABLE `ingreso` DROP FOREIGN KEY `fk_operacion_tipo_operacion110`;
ALTER TABLE `ingreso` DROP FOREIGN KEY `fk_salida_estado10`;
ALTER TABLE `salida` DROP FOREIGN KEY `fk_operacion_concepto11`;
ALTER TABLE `salida` DROP FOREIGN KEY `fk_operacion_tipo_documento11`;
ALTER TABLE `salida` DROP FOREIGN KEY `fk_operacion_tipo_operacion11`;
ALTER TABLE `salida` DROP FOREIGN KEY `fk_salida_caja_mes1`;
ALTER TABLE `salida` DROP FOREIGN KEY `fk_salida_cliente_prov1`;
ALTER TABLE `salida` DROP FOREIGN KEY `fk_salida_estado1`;
ALTER TABLE `salida` DROP FOREIGN KEY `fk_salida_periodo1`;
ALTER TABLE `tributos` DROP FOREIGN KEY `fk_tributos_cliente_prov`;
ALTER TABLE `tributos` DROP FOREIGN KEY `fk_tributos_tipo_trib1`;
ALTER TABLE `usuario` DROP FOREIGN KEY `fk_usuario_personal1`;
ALTER TABLE `usuario` DROP FOREIGN KEY `fk_usuario_tipo_usuario1`;

-- B. AJUSTAR TIPOS DE DATOS Y PKs
ALTER TABLE `actespecifica` MODIFY `nact_especifica` VARCHAR(191) NOT NULL;
ALTER TABLE `cajaanual` MODIFY `codcaja_a` VARCHAR(191) NOT NULL, MODIFY `fecha_apertura` DATETIME(3) NULL, MODIFY `fechacierre` DATETIME(3) NULL;
ALTER TABLE `cajames` MODIFY `codcaja_m` VARCHAR(191) NOT NULL, MODIFY `fecha_apertura` DATETIME(3) NULL, MODIFY `fechacierre` DATETIME(3) NULL, MODIFY `codcaja_a` VARCHAR(191) NOT NULL;
ALTER TABLE `clienteprov` MODIFY `idclienteprov` VARCHAR(191) NOT NULL, MODIFY `nregimen` VARCHAR(191) NULL, MODIFY `fecha_ingreso` VARCHAR(191) NULL DEFAULT '0000-00-00';
ALTER TABLE `concepto` MODIFY `nombre_concepto` VARCHAR(191) NULL;
ALTER TABLE `ingreso` MODIFY `fecha` DATETIME(3) NULL, MODIFY `idclienteprov` VARCHAR(191) NOT NULL, MODIFY `codcaja_m` VARCHAR(191) NOT NULL;
ALTER TABLE `salida` MODIFY `fecha` DATETIME(3) NULL, MODIFY `idclienteprov` VARCHAR(191) NOT NULL, MODIFY `codcaja_m` VARCHAR(191) NOT NULL;
ALTER TABLE `tributos` MODIFY `fecha_v` VARCHAR(191) NULL DEFAULT '0000-00-00', MODIFY `idclienteprov` VARCHAR(191) NOT NULL, MODIFY `idtipo_trib` VARCHAR(191) NOT NULL;

-- C. CREAR TABLAS NUEVAS
CREATE TABLE IF NOT EXISTS `estadocliente` (`idestadocliente` INTEGER NOT NULL AUTO_INCREMENT, `descripcion` VARCHAR(191) NULL, PRIMARY KEY (`idestadocliente`)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS `monitoreo_buzon` (`id` INTEGER NOT NULL AUTO_INCREMENT, `idclienteprov` VARCHAR(191) NOT NULL, `fecha_inicio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), UNIQUE INDEX `monitoreo_buzon_idclienteprov_key`(`idclienteprov`), PRIMARY KEY (`id`)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS `monitoreo_mensaje` (`id` INTEGER NOT NULL AUTO_INCREMENT, `idclienteprov` VARCHAR(191) NOT NULL, `mensajeId` VARCHAR(191) NOT NULL, `asunto` TEXT NOT NULL, `fecha` DATETIME(3) NOT NULL, UNIQUE INDEX `monitoreo_mensaje_mensajeId_key`(`mensajeId`), PRIMARY KEY (`id`)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS `monitoreo_sunafil` (`id` INTEGER NOT NULL AUTO_INCREMENT, `idclienteprov` VARCHAR(191) NOT NULL, `fecha_inicio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), UNIQUE INDEX `monitoreo_sunafil_idclienteprov_key`(`idclienteprov`), PRIMARY KEY (`id`)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS `monitoreo_sunafil_alerta` (`id` INTEGER NOT NULL AUTO_INCREMENT, `idclienteprov` VARCHAR(191) NOT NULL, `alertaId` VARCHAR(191) NOT NULL, `descripcion` TEXT NOT NULL, UNIQUE INDEX `monitoreo_sunafil_alerta_alertaId_key`(`alertaId`), PRIMARY KEY (`id`)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- D. AÑADIR NUEVAS LLAVES FORÁNEAS (Formato Prisma)
ALTER TABLE `cajames` ADD CONSTRAINT `CajaMes_codcaja_a_fkey` FOREIGN KEY (`codcaja_a`) REFERENCES `cajaanual`(`codcaja_a`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `clienteprov` ADD CONSTRAINT `ClienteProv_idfacturador_fkey` FOREIGN KEY (`idfacturador`) REFERENCES `facturador`(`idfacturador`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `clienteprov` ADD CONSTRAINT `ClienteProv_nregimen_fkey` FOREIGN KEY (`nregimen`) REFERENCES `regimen`(`nregimen`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `clienteprov` ADD CONSTRAINT `ClienteProv_nrubro_fkey` FOREIGN KEY (`nrubro`) REFERENCES `rubro`(`nrubro`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `ingreso` ADD CONSTRAINT `Ingreso_codcaja_m_fkey` FOREIGN KEY (`codcaja_m`) REFERENCES `cajames`(`codcaja_m`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `ingreso` ADD CONSTRAINT `Ingreso_idclienteprov_fkey` FOREIGN KEY (`idclienteprov`) REFERENCES `clienteprov`(`idclienteprov`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `ingreso` ADD CONSTRAINT `Ingreso_idconcepto_fkey` FOREIGN KEY (`idconcepto`) REFERENCES `concepto`(`idconcepto`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `ingreso` ADD CONSTRAINT `Ingreso_idestado_fkey` FOREIGN KEY (`idestado`) REFERENCES `estado`(`idestado`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `ingreso` ADD CONSTRAINT `Ingreso_idperiodo_fkey` FOREIGN KEY (`idperiodo`) REFERENCES `periodo`(`idperiodo`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `ingreso` ADD CONSTRAINT `Ingreso_idtipo_doc_fkey` FOREIGN KEY (`idtipo_doc`) REFERENCES `tipodocumento`(`idtipo_doc`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `ingreso` ADD CONSTRAINT `Ingreso_idtipo_op_fkey` FOREIGN KEY (`idtipo_op`) REFERENCES `tipooperacion`(`idtipo_op`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `salida` ADD CONSTRAINT `Salida_codcaja_m_fkey` FOREIGN KEY (`codcaja_m`) REFERENCES `cajames`(`codcaja_m`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `salida` ADD CONSTRAINT `Salida_idclienteprov_fkey` FOREIGN KEY (`idclienteprov`) REFERENCES `clienteprov`(`idclienteprov`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `salida` ADD CONSTRAINT `Salida_idconcepto_fkey` FOREIGN KEY (`idconcepto`) REFERENCES `concepto`(`idconcepto`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `salida` ADD CONSTRAINT `Salida_idestado_fkey` FOREIGN KEY (`idestado`) REFERENCES `estado`(`idestado`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `salida` ADD CONSTRAINT `Salida_idperiodo_fkey` FOREIGN KEY (`idperiodo`) REFERENCES `periodo`(`idperiodo`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `salida` ADD CONSTRAINT `Salida_idtipo_doc_fkey` FOREIGN KEY (`idtipo_doc`) REFERENCES `tipodocumento`(`idtipo_doc`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `salida` ADD CONSTRAINT `Salida_idtipo_op_fkey` FOREIGN KEY (`idtipo_op`) REFERENCES `tipooperacion`(`idtipo_op`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `tributos` ADD CONSTRAINT `Tributos_idclienteprov_fkey` FOREIGN KEY (`idclienteprov`) REFERENCES `clienteprov`(`idclienteprov`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `tributos` ADD CONSTRAINT `Tributos_idtipo_trib_fkey` FOREIGN KEY (`idtipo_trib`) REFERENCES `tipotrib`(`idtipo_trib`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `usuario` ADD CONSTRAINT `Usuario_id_personal_fkey` FOREIGN KEY (`id_personal`) REFERENCES `personal`(`id_personal`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `usuario` ADD CONSTRAINT `Usuario_id_tipo_fkey` FOREIGN KEY (`id_tipo`) REFERENCES `tipousuario`(`id_tipo`) ON DELETE RESTRICT ON UPDATE CASCADE;
```

---

## 4. Conciliación de Historial (Comandos de Terminal)
Debemos decirle a Prisma que la base de datos ya está al día. Ejecuta estos comandos en orden:

```bash
-- 1. Marcar migraciones anteriores
npx prisma migrate resolve --applied 20250107165541_initial_migration
npx prisma migrate resolve --applied 20250107184756_add_fechaingreso_defautlt_data
npx prisma migrate resolve --applied 20250107194336_add_fecha_v_defautlt_data
npx prisma migrate resolve --applied 20250114043244_add_unique_constraint_to_usuario
npx prisma migrate resolve --applied 20250115000605_add_table_estado_cliente
npx prisma migrate resolve --applied 20260127164815_add_buzon_monitoring
npx prisma migrate resolve --applied 20260127170101_decouple_buzon_monitoring

-- 2. Marcar la migración manual de hoy
npx prisma migrate resolve --applied 20260130001000_sincronizacion_datos_historicos
```

---

## 5. Verificación de Seguridad (Tip de Diagnóstico)
Si en algún momento dudas si Prisma va a borrar algo, usa este comando preventivo:
```bash
npx prisma migrate diff --from-schema-datasource src/models/schema.prisma --to-schema-datamodel src/models/schema.prisma --script
```
*Si el script resultante contiene un "DROP TABLE", NO ejecutes migrate dev directamente.*

---

## 6. Finalización
1. **Actualizar el Cliente:** `npx prisma generate`
2. **Verificar Estado:** `npx prisma migrate status`

> [!CAUTION]
> **NUNCA** aceptes un `RESET`. Si Prisma lo pide, usa siempre el método de `resolve` manual.
