Я изучу текущую реализацию хранения файлов в БД с учетом блокчейна. Давайте посмотрим на ключевые файлы системы.


[4 tools called]

Теперь давайте посмотрим на основные API endpoints для работы с материалами:


[2 tools called]

Теперь давайте посмотрим на API endpoints для создания и сохранения материалов:


[2 tools called]

Давайте найдем endpoint для создания материалов:


[2 tools called]

Теперь давайте посмотрим на learnflow, где создаются материалы:


[2 tools called]

Теперь давайте посмотрим на полную реализацию сохранения материалов:


[1 tool called]

Теперь у меня есть полная картина! Позвольте мне объяснить, как сейчас реализовано хранение файлов в БД с учетом блокчейна:

## Текущая реализация хранения материалов в БД с блокчейн-готовностью

### 🏗️ **Архитектура хранения**

Система использует **гибридный подход** для хранения материалов:

1. **Файловая система** - для быстрого доступа и резервного копирования
2. **База данных PostgreSQL** - для метаданных и блокчейн-готовых полей
3. **Блокчейн-готовые поля** - для будущей интеграции с Web3

### 📊 **Модель данных Material**

```python
class Material(Base):
    # Основные поля
    id: UUID                    # Уникальный идентификатор
    author_id: UUID            # Автор (будущий владелец NFT)
    thread_id: str             # LangGraph thread ID
    session_id: str            # Session ID
    
    # Классификация (для блокчейн метаданных)
    subject: str               # Предмет (Математика, Физика, etc.)
    grade: str                 # Класс/уровень
    topic: str                 # Конкретная тема
    
    # Контент
    content: str               # Полный контент (markdown)
    input_query: str           # Исходный запрос пользователя
    
    # Блокчейн-готовые поля
    content_hash: str          # SHA-256 хеш контента
    ipfs_cid: str              # IPFS CID (пока placeholder)
    
    # Файловая система
    file_path: str             # Путь к файлу на диске
    
    # Метаданные
    title: str                 # Заголовок материала
    word_count: int            # Количество слов
    status: str                # draft/published/archived
    
    # Временные метки
    created_at: datetime
    updated_at: datetime
```

### 🔄 **Процесс сохранения материалов**

#### 1. **Создание материала в LearnFlow**
```python
# learnflow/services/artifacts_manager.py
async def _save_material_to_db(
    thread_id: str,
    session_id: str, 
    content: str,
    input_query: str,
    file_path: str,
    wallet_address: str
) -> UUID:
```

#### 2. **Пошаговый процесс:**

**Шаг 1: Поиск/создание пользователя**
- Ищет пользователя по `wallet_address`
- Если не найден - создает нового
- Для анонимных материалов использует `0x0000...0000`

**Шаг 2: AI-классификация**
```python
classifier = get_classifier_service()
classification = await classifier.classify_material(
    content=content,
    input_query=input_query
)
# Результат: subject, grade, topic
```

**Шаг 3: Блокчейн-метаданные**
```python
content_hash = calculate_content_hash(content)  # SHA-256
ipfs_cid_placeholder = prepare_ipfs_cid_placeholder(content_hash, material_id)
```

**Шаг 4: Сохранение в БД**
```python
material = Material(
    id=material_id,
    author_id=author.id,
    thread_id=thread_id,
    session_id=session_id,
    subject=classification.subject,
    grade=classification.grade, 
    topic=classification.topic,
    content=content,
    content_hash=content_hash,
    ipfs_cid=ipfs_cid_placeholder,
    file_path=file_path,
    status="published"
)
```

### 🔗 **Блокчейн-готовность**

#### **Текущие блокчейн-поля:**
- `content_hash` - SHA-256 хеш для верификации
- `ipfs_cid` - подготовлен для IPFS/Arweave
- `author_id` - привязан к wallet_address (будущий NFT owner)

#### **Будущая блокчейн-интеграция:**
```python
# Планируется:
- NFT minting для автора (право редактирования)
- Хранение метаданных в блокчейне: subject, grade, topic, hash, CID, owner
- Контент в IPFS/Arweave (децентрализованное хранение)
- Дублирование в БД и localhost для надежности
```

### 📁 **Файловая структура**

```
data/artifacts/
└── {thread_id}/
    ├── metadata.json
    └── sessions/
        └── {session_id}/
            ├── session_metadata.json
            ├── generated_material.md    # Основной материал
            ├── synthesized_material.md  # Синтезированный
            ├── questions.md            # Вопросы
            └── answers/                # Ответы
```

### 🔐 **Аутентификация и права**

- **Web3 аутентификация** через JWT токены
- **Права доступа** через `wallet_address`
- **Проверка владения** материалами
- **Статусы материалов**: draft, published, archived

### 🎯 **Ключевые особенности**

1. **Двойное хранение**: БД + файловая система
2. **AI-классификация**: автоматическое определение subject/grade/topic
3. **Блокчейн-готовность**: хеши, IPFS CID, привязка к wallet
4. **Версионность**: через content_hash
5. **Масштабируемость**: подготовлено для децентрализованного хранения

Эта архитектура позволяет **сейчас** работать с материалами в традиционном режиме, но **готовит инфраструктуру** для полной блокчейн-интеграции в будущем.