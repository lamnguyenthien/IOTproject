import { useEffect } from "react"

const useData = (callback, deps) => {
    return useEffect(() => {
        callback();
        return () => {}
    }, [...deps])
}

export default useData;