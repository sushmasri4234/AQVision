import { useState } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const UploadData = () => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile)
        setUploadResult(null)
      } else {
        toast.error('Please select a CSV or Excel file')
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first')
      return
    }

    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload-readings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        setUploadResult(result)
        toast.success('File uploaded successfully!')
        setFile(null)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const sampleData = `zone_id,timestamp,aqi,pm25,pm10,no2,so2,co,o3,temperature,humidity,wind_speed,wind_direction
anand_vihar,2024-01-15T10:00:00Z,287,320,450,85,25,2.1,12,18,65,8,180
rk_puram,2024-01-15T10:00:00Z,210,220,310,60,20,1.8,10,19,62,10,200
dwarka,2024-01-15T10:00:00Z,195,200,290,55,18,1.6,15,20,58,12,220`

  const downloadSample = () => {
    const blob = new Blob([sampleData], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample_readings.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Upload Air Quality Data</h2>
          <p className="text-gray-600 mt-1">Upload CSV or Excel files containing air quality readings</p>
        </div>
        
        <div className="p-6">
          <div className="max-w-lg mx-auto">
            <div className="mb-6">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">CSV or Excel files only</p>
                  {file && (
                    <div className="mt-4 flex items-center space-x-2 text-sm text-blue-600">
                      <FileText size={16} />
                      <span>{file.name}</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                />
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    <span>Upload File</span>
                  </>
                )}
              </button>
              
              <button
                onClick={downloadSample}
                className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
              >
                <FileText size={16} />
                <span>Sample CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {uploadResult && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <CheckCircle className="text-green-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Upload Results</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{uploadResult.count}</div>
                <div className="text-sm text-green-700">Records Processed</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{uploadResult.total}</div>
                <div className="text-sm text-blue-700">Total Records</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-600">
                  {uploadResult.total - uploadResult.count}
                </div>
                <div className="text-sm text-yellow-700">Skipped/Invalid</div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">{uploadResult.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">File Format Requirements</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-yellow-500 mt-0.5" size={16} />
              <div>
                <p className="text-sm font-medium text-gray-900">Required Columns</p>
                <p className="text-sm text-gray-600">
                  zone_id, timestamp, aqi, pm25, pm10, no2, so2, co, o3, temperature, humidity, wind_speed, wind_direction
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-yellow-500 mt-0.5" size={16} />
              <div>
                <p className="text-sm font-medium text-gray-900">Timestamp Format</p>
                <p className="text-sm text-gray-600">
                  ISO 8601 format: YYYY-MM-DDTHH:mm:ssZ (e.g., 2024-01-15T10:00:00Z)
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-yellow-500 mt-0.5" size={16} />
              <div>
                <p className="text-sm font-medium text-gray-900">Zone IDs</p>
                <p className="text-sm text-gray-600">
                  Must match existing zone IDs in the system (e.g., anand_vihar, rk_puram, dwarka)
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-yellow-500 mt-0.5" size={16} />
              <div>
                <p className="text-sm font-medium text-gray-900">Data Validation</p>
                <p className="text-sm text-gray-600">
                  AQI values must be between 0-500. Temperature in Celsius, humidity as percentage, wind speed in km/h
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadData