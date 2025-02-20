export type JwtUserEstabelecimento = {
  id: string;
  nm_fantasia: string;
  nm_razao_social: string;
  nr_documento: string;
};

export type JwtUserPerfil = {
  id: string;
  nm_perfil: string;
  id_cliente: string;
  estabelecimentos: JwtUserEstabelecimento[];
};

export type JwtUser = {
  id: string;
  ds_email: string;
  nm_usuario: string;
  nr_telefone: string;
  ds_area: string;
  tp_acesso: string;
  ds_acesso: string;
  fg_email_confirmado: string;
  perfil: JwtUserPerfil;
  menus: any[];
};
