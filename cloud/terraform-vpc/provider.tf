terraform {
  required_version = ">= 0.12.7"
}
provider "google" {
  credentials = file(var.key)
  project     = var.project_id
  region      = var.region
}