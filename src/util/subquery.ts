import axios from "axios"

export const callSubquery = async (query: string, variables?: any) => {
    const subqueryUrl = "https://api.subquery.network/sq/perpdex/shibuya_test2"

    const headers = {
        "content-type": "application/json",
    }

    const graphqlQuery = {
        query,
        variables,
    }

    const response = await axios.post(subqueryUrl, graphqlQuery, {
        headers,
    })

    const data = response.data.data

    return data
}
