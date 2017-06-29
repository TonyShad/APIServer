# API Server

Сервер для обработки запросов пользователя.
Http сервер.

### Инструкция по работе с сервером
Установка зависимостей:
`npm i && sudo npm i -g nodemon`

Запуск:
`npm start`

## Авторизация
### /registration
Запрос на регистрацию пользователя в системе.
##### Параметры
```javascript
{
	"email": {
		"type": "string",
		"description": "email адрес пользователя"
	}
	"password": {
		"type": "string",	
		"description": "пароль пользователя"
	}
}
```
##### Ответ
```javascript
{
	"sessionid": {
		"type": "string",
		"description": "id сессии нового пользователя"
	}
}
```
### /login
Авторизация пользователя в системе.
##### Параметры
```javascript
{
	"email": {
		"type": "string",
		"description": "email адрес пользователя"
	}
	"password": {
		"type": "string",	
		"description": "пароль пользователя"
	}
}
```
##### Ответ
```javascript
{
	"sessionid": {
		"type": "string",
		"description": "id сессии нового пользователя"
	}
}
```

### /logout
Выход пользователя из системы.
##### Параметры
нет

##### Header запроса
```javascript
{
	"SessionID": {
		"type": "string",
		"description": "id сессии пользователя"
	}
}
```
##### Ответ
1. Пользователь был авторизован в системе
```javascript
{
	"User is now logged out": {
		"type": "string",
		"description": "сообщение о выходе из системы"
	}
}
```
2. Пользователь не был авторизован
```javascript
{
	"User is logged out": {
		"type": "string",
		"description": "сообщение о том, что пользователь не был авторизован в системе"
	}
}
```

## Запросы пользователя
### get /user/decks
Получить массив колод пользователей.
##### Параметры
нет.
Пользователь должен быть авторизован.
##### Ответ
```javascript
{
	"decks": {
		"type": "array",
		"description": "массив объектов deck: {name: 'string', cards: []}"
	}
}
```

### post /user/decks
Создать колоду.
##### Параметры
```javascript
{
  "name": {
    "type": "string",
    "description": "Название колоды"
  }
  "cards": {
    "type": "array",
    "description": "Массив карт, которые будут входить в колоду"
  }
}
```
Пользователь должен быть авторизован.
##### Ответ
```javascript
{
	"decks": {
		"type": "array",
		"description": "массив объектов deck: {name: 'string', cards: []}"
	}
}
```

### put /user/decks/:deckID
Изменить конкретную колоду.
##### Параметры
```javascript
{
  "name": {
    "type": "string",
    "description": "Название колоды"
  },
  "cards": {
    "type": "array",
    "description": "Массив карт, которые будут входить в колоду"
  },
  
}
```
Пользователь должен быть авторизован.
##### Ответ
```javascript
{
	"Deck {deckID} was updated": {
		"type": "string",
		"description": "Сообщение о статусе запроса"
	}
}
```

### delete /user/decks/:deckID
Удалить конкретную колоду.
##### Параметры
```javascript
{
  "deckID": {
    "type": "string",
    "description": "id колоды"
  }
}
```
Пользователь должен быть авторизован.
##### Ответ
```javascript
{
	"Deck {deckID} was deleted": {
		"type": "string",
		"description": "Сообщение о статусе запроса"
	}
}
```

### get /user/collection
Получить список карт пользователя
##### Параметры
нет.
Пользователь должен быть авторизован.
##### Ответ
```javascript
{
	"cards": {
		"type": "array",
		"description": "массив объектов card: {card_id: 'string'}"
	}
}
```

### post /user/collection
Добавить карту в коллекцию пользователя
##### Параметры
```javascript
{
  "cards": {
    "type": "array",
    "description": "Массив карт, которые будут добавлены в коллекцию пользователя"
  }
}
```
Пользователь должен быть авторизован.
##### Ответ
```javascript
{
	"cards": {
		"type": "array",
		"description": "массив объектов card: {card_id: 'string'}"
	}
}
```
