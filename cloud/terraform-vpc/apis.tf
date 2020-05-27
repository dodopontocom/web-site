# Habilitar as APIs necessárias
resource "google_project_service" "services" {
  count   = length(var.service_list)
  project = var.project_id
  service = var.service_list[count.index]

  disable_dependent_services = true
  disable_on_destroy         = false
  
}