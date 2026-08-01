-- =========================================
-- BLOOM FLORISTERÍA
-- Seguridad de la base de datos
-- =========================================


-- ACTIVAR SEGURIDAD EN TABLAS

ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;

ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

ALTER TABLE detalle_pedidos ENABLE ROW LEVEL SECURITY;

ALTER TABLE promociones ENABLE ROW LEVEL SECURITY;

ALTER TABLE configuracion ENABLE ROW LEVEL SECURITY;

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;



-- =========================================
-- PRODUCTOS
-- =========================================


CREATE POLICY "Clientes pueden ver productos"

ON productos

FOR SELECT

USING (

estado = 'Disponible'

);



CREATE POLICY "Admin puede administrar productos"

ON productos

FOR ALL

USING (

auth.role() = 'authenticated'

);



-- =========================================
-- CATEGORÍAS
-- =========================================


CREATE POLICY "Ver categorías"

ON categorias

FOR SELECT

USING (true);



CREATE POLICY "Admin categorías"

ON categorias

FOR ALL

USING (

auth.role() = 'authenticated'

);



-- =========================================
-- PEDIDOS
-- =========================================


CREATE POLICY "Crear pedidos"

ON pedidos

FOR INSERT

WITH CHECK (true);



CREATE POLICY "Admin ver pedidos"

ON pedidos

FOR SELECT

USING (

auth.role() = 'authenticated'

);



-- =========================================
-- CONFIGURACIÓN
-- =========================================


CREATE POLICY "Ver configuración Bloom"

ON configuracion

FOR SELECT

USING (true);



CREATE POLICY "Editar configuración Bloom"

ON configuracion

FOR ALL

USING (

auth.role() = 'authenticated'

);