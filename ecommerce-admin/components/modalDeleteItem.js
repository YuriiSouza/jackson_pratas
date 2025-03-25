import axios from "axios";
import { useRouter } from "next/router";

export default function ModalDelete({
  word: wordReference,
  id
}) {
  const router = useRouter();

  async function deleteItem(word, id_) {
    try {
      await axios.delete(`/api/${wordReference}?id=${id}`).then((response) => {
        if(response.status == 200) {
          router.reload()
        }
      })
      
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Erro ao deletar o item.");
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">Excluir {wordReference}?</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-lg text-gray-500">
              Tem certeza de que deseja excluir este {wordReference}?
            </p>
          </div>
          <div className="flex justify-center mt-4 gap-2">
            {/* Botão para cancelar */}
            <button
              onClick={(ev) => {
                ev.preventDefault;
                router.reload()
              }}

              className="px-4 py-2 bg-gray-400 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancelar
            </button>

            {/* Botão para confirmar exclusão */}
            <button
                onClick={(ev) => {
                  deleteItem(wordReference, id)}
                }
              
              className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
