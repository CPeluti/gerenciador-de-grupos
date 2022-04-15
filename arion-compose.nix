{ pkgs, ... }:
{
  services.postgres = {
    service.image = "postgres:14.2-alpine";
    service.volumes = ["${toString ./db}:/var/lib/postgresql/data"];
    service.ports = ["5432:5432"];
    service.environment= {
      POSTGRES_PASSWORD = "senhaForte";
      POSTGRES_USER = "servidor";
    };
  };
}
