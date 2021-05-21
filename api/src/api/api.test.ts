// curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' -H 'Authorization: tk9-ZDPzsqg7X2Zx7CkT-' --data-binary '{"query":"{\n  categories(searchText: \"net\") {\n    total\n    categories {\n      id\n      rootCategoryId\n      path\n    }\n  }\n}\n"}' --compressed
// curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' -H 'Authorization: tk9-ZDPzsqg7X2Zx7CkT-' --data-binary '{"query":"mutation {\n  activateUser(id: 2) {\n    id\n    uuid\n    isActive\n    role\n    token\n  }\n}\n"}' --compressed
// curl '/graphql' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' -H 'Authorization: tk9-ZDPzsqg7X2Zx7CkT-' --data-binary '{"query":"# Write your query or mutation here\n{\n  users {\n    id\n    uuid\n    role\n  }\n}\n"}' --compressed
// curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' -H 'Authorization: ' --data-binary '{"query":"mutation {\n  loginAdmin(login: \"admin\", password: \"password123\") {\n    id\n    login\n    token\n  }\n}\n"}' --compressed
