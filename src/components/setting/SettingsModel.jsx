
import { useState, useRef } from "react"
import { Card, CardBody, CardHeader, Button, Progress, Divider } from "@nextui-org/react"
import { Upload, FileText, Brain, AlertTriangle, CheckCircle } from "lucide-react"
import axios from "axios"

export const SettingsModel = () => {
    
  const URLAPI = process.env.REACT_APP_URLAPI;
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [isRetraining, setIsRetraining] = useState(false)
  const [retrainingProgress, setRetrainingProgress] = useState(0)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  // const handleFileSelect = (e) => {
  //   const files = Array.from(e.target.files)
  //   handleFiles(files)
  // }

  // const handleFiles = (files) => {
  //   const newFiles = files.map((file) => ({
  //     id: Date.now() + Math.random(),
  //     name: file.name,
  //     size: file.size,
  //     type: file.type,
  //     file: file,
  //   }))
  //   setUploadedFiles((prev) => [...prev, ...newFiles])
  // }

  const removeFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // const handleRetrain = () => {
  //   setIsRetraining(true)
  //   setRetrainingProgress(0)

  //   // Simular progreso de reentrenamiento
  //   const interval = setInterval(() => {
  //     setRetrainingProgress((prev) => {
  //       if (prev >= 100) {
  //         clearInterval(interval)
  //         setIsRetraining(false)
  //         return 100
  //       }
  //       return prev + Math.random() * 15
  //     })
  //   }, 500)
  // }

  const handleRetrain = async () => {
  if (uploadedFiles.length === 0) {
    alert('Por favor selecciona un archivo primero');
    return;
  }

 setIsRetraining(true);
 setRetrainingProgress(0);

 try {
   // Crear FormData para enviar el archivo
   const formData = new FormData();
   formData.append('file', uploadedFiles[0].file); // Solo el primer archivo

   // Simular progreso mientras se procesa
   const progressInterval = setInterval(() => {
     setRetrainingProgress((prev) => {
       if (prev >= 90) {
         clearInterval(progressInterval);
         return 90;
       }
       return prev + Math.random() * 10;
     });
   }, 500);

   // Hacer la petición al backend
   const res = await axios.post(`${URLAPI}/setting/retrain`, formData, {
     headers: {
       'Content-Type': 'multipart/form-data',
     }
   });

   clearInterval(progressInterval);

   if (res.data.status) {
     setRetrainingProgress(100);
   } else {
     throw new Error(res.data.error || 'Error en el reentrenamiento');
   }

 } catch (error) {
   console.error('Error durante el reentrenamiento:', error);
   setRetrainingProgress(0);
   alert('Error durante el reentrenamiento: ' + error.message);
 } finally {
   setIsRetraining(false);
 }
};

  const handleFiles = (files) => {
  // Solo permitir un archivo
  const file = files[0];
  if (file) {
    const newFile = {
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    };
    setUploadedFiles([newFile]); // Reemplazar, no agregar
  }
  };

  const handleFileSelect = (e) => {
  const files = Array.from(e.target.files);
  handleFiles(files);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Configuración del Modelo</h1>
        <p className="text-gray-600">Gestiona los archivos de entrenamiento y reentrenamiento del modelo</p>
      </div>

      {/* Sección de carga de archivos */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold">Cargar Archivos de Entrenamiento</h2>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          {/* Zona de drag & drop */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? "text-blue-500" : "text-gray-400"}`} />
            <p className="text-lg font-medium text-gray-700 mb-2">
              {isDragging ? "Suelta los archivos aquí" : "Arrastra archivos aquí o haz clic para seleccionar"}
            </p>
            <p className="text-sm text-gray-500">Formato soportado: csv</p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept=".csv,.json,.txt,.pdf"
            />
          </div>

          {/* Lista de archivos cargados */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">Archivos cargados ({uploadedFiles.length})</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-sm text-gray-800">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button size="sm" color="danger" variant="light" onClick={() => removeFile(file.id)}>
                      Eliminar
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <Divider />

      {/* Sección de reentrenamiento */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-semibold">Reentrenamiento del Modelo</h2>
          </div>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800 mb-1">Reentrenamiento Necesario</h3>
              <p className="text-sm text-amber-700">
                Se han detectado nuevos datos de entrenamiento. Es recomendable reentrenar el modelo para mejorar su
                precisión y rendimiento con la nueva información.
              </p>
            </div>
          </div>

          {isRetraining && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Progreso del reentrenamiento</span>
                <span className="text-sm text-gray-500">{Math.round(retrainingProgress)}%</span>
              </div>
              <Progress value={retrainingProgress} color="success" className="w-full" />
              <p className="text-xs text-gray-500">
                Este proceso puede tomar varios minutos dependiendo del tamaño de los datos...
              </p>
            </div>
          )}

          {retrainingProgress === 100 && !isRetraining && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">¡Reentrenamiento completado exitosamente!</span>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              color="primary"
              size="lg"
              onClick={handleRetrain}
              disabled={isRetraining || uploadedFiles.length === 0}
              className="flex-1"
            >
              {isRetraining ? "Reentrenando..." : "Iniciar Reentrenamiento"}
            </Button>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>• El reentrenamiento utilizará todos los archivos cargados</p>
            <p>• Se recomienda hacer una copia de seguridad antes del reentrenamiento</p>
            <p>• El modelo anterior se mantendrá como respaldo</p>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}