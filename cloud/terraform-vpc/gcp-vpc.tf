//Criar Virtual Private Cloud
resource "google_compute_network" "vpc" {
    name    = var.vpc_name
}