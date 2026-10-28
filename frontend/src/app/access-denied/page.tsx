export default function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Acesso Negado</h1>
      <p className="text-lg text-gray-600">
        Você não tem permissão para acessar esta página.
      </p>
    </div>
  );
}
