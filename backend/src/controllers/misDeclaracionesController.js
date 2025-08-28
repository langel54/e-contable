const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

const ahkExecutable =
  '"C:\\Program Files\\AutoHotkey\\v1.1.37.02\\AutoHotkeyU64.exe"';
const appPath =
  '"C:\\Program Files (x86)\\Mis Declaraciones\\recaudacion3-tributaria-integrador-ejecutor-desktop-1.59.0.exe"';

// Controlador para rellenar el formulario
const openMisDeclaracionesApp = async (req, res) => {
  //   const { name, email, phone } = req.body;
  const name = "12345678912";
  const email = "OITINOSI";
  const phone = "sisghoult";
  // Generar el script AHK para rellenar los campos del formulario
  const ahkScript = `
SendMode Input

; Ejecutar como administrador al iniciar
if not A_IsAdmin
{
    Run *RunAs "%A_ScriptFullPath%"
    ExitApp
}

; Iniciar la aplicación
Run,${appPath}"
Sleep, 1000  ; Aumentar tiempo de espera

; Activar y verificar la ventana
WinActivate, ahk_class GlassWndClass-GlassWindowClass-2
WinWaitActive, ahk_class GlassWndClass-GlassWindowClass-2


; Prueba de envío de datos con ControlSend
ControlSend,, 10462857361, ahk_class GlassWndClass-GlassWindowClass-2
ControlSend,, {Tab}, ahk_class GlassWndClass-GlassWindowClass-2
ControlSend,, OITINOSI, ahk_class GlassWndClass-GlassWindowClass-2
ControlSend,, {Tab}, ahk_class GlassWndClass-GlassWindowClass-2
ControlSend,, sishogult, ahk_class GlassWndClass-GlassWindowClass-2
Sleep, 1000  ; Aumentar tiempo de espera

ControlSend,, {Enter}, ahk_class GlassWndClass-GlassWindowClass-2
`;

  // Ruta en el disco local donde guardar el script de AutoHotkey
  const ahkFilePath = "D:\\rellenar.ahk";

  // Escribir el script en el archivo
  fs.writeFileSync(ahkFilePath, ahkScript);

  // Ejecutar el script de AutoHotkey
  exec(`${ahkExecutable} "${ahkFilePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al ejecutar el script: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }

    console.log("Formulario rellenado con éxito");
    res.send("Formulario rellenado con éxito");
  });
};

module.exports = { openMisDeclaracionesApp };
