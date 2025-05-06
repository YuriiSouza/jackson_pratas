export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-800">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Acesso negado</h1>
        <p>Você não tem permissão para acessar esta página.</p>
      </div>
    </div>
  );
}
