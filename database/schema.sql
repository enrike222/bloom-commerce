-- =========================================
-- BLOOM FLORISTERÍA
-- Base de datos principal
-- =========================================


-- CATEGORÍAS DE PRODUCTOS

CREATE TABLE categorias (

    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    nombre TEXT NOT NULL,

    descripcion TEXT,

    created_at TIMESTAMP DEFAULT NOW()

);



-- PRODUCTOS

CREATE TABLE productos (

    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    categoria_id UUID REFERENCES categorias(id),

    nombre TEXT NOT NULL,

    descripcion TEXT,

    precio DECIMAL(10,2) NOT NULL,

    imagen TEXT,

    estado TEXT DEFAULT 'Disponible',

    created_at TIMESTAMP DEFAULT NOW()

);



-- CLIENTES

CREATE TABLE clientes (

    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    nombre TEXT NOT NULL,

    telefono TEXT,

    correo TEXT,

    direccion TEXT,

    created_at TIMESTAMP DEFAULT NOW()

);



-- PEDIDOS

CREATE TABLE pedidos (

    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    cliente_id UUID REFERENCES clientes(id),

    total DECIMAL(10,2),

    estado TEXT DEFAULT 'Pendiente',

    fecha_entrega DATE,

    created_at TIMESTAMP DEFAULT NOW()

);



-- PRODUCTOS DENTRO DE PEDIDOS

CREATE TABLE detalle_pedidos (

    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,

    producto_id UUID REFERENCES productos(id),

    cantidad INTEGER DEFAULT 1,

    precio DECIMAL(10,2)

);



-- USUARIOS DEL ADMIN

CREATE TABLE usuarios (

    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    nombre TEXT NOT NULL,

    correo TEXT UNIQUE NOT NULL,

    password TEXT NOT NULL,

    rol TEXT DEFAULT 'Administrador',

    created_at TIMESTAMP DEFAULT NOW()

);



-- PROMOCIONES

CREATE TABLE promociones (

    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    nombre TEXT NOT NULL,

    descripcion TEXT,

    descuento INTEGER,

    fecha_inicio DATE,

    fecha_fin DATE,

    estado TEXT DEFAULT 'Activa',

    created_at TIMESTAMP DEFAULT NOW()

);



-- CONFIGURACIÓN DE BLOOM

CREATE TABLE configuracion (

    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    nombre_tienda TEXT DEFAULT 'Bloom',

    whatsapp TEXT,

    instagram TEXT,

    direccion TEXT,

    horario TEXT,

    logo TEXT,

    updated_at TIMESTAMP DEFAULT NOW()

);