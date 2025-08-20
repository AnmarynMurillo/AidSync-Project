<!--
Página de perfil de usuario.
Muestra y permite editar los datos del usuario autenticado.
Permite cambiar la foto de perfil.
-->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Profile</title>
    <link rel="stylesheet" href="../css/profile.css">
</head>
<body>
    <h2>My Profile</h2>
    <div id="profileContainer">
        <!-- Foto de perfil -->
        <img id="profilePic" src="../assets/img/default-profile.png" alt="Foto de perfil" width="120" height="120">
        <form id="photoForm" enctype="multipart/form-data">
            <input type="file" id="photoInput" accept="image/*">
            <button type="submit">Change Profile Picture</button>
        </form>
        <!-- Datos del usuario en modo solo lectura -->
        <div id="profileData">
            <p><strong>Full name:</strong> <span id="nombre"></span></p>
            <p><strong>Age:</strong> <span id="edad"></span></p>
            <p><strong>Volunteering Area:</strong> <span id="area"></span></p>
            <p><strong>Email:</strong> <span id="email"></span></p>
        </div>
        <div id="profileMessage"></div>
    </div>
    <script src="../js/profile.js"></script>
</body>
</html>
        <div id="profileMessage"></div>
    </div>
    <script src="../js/profile.js"></script>
</body>
</html>

