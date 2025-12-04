"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "./button"
import { Input } from "./input"
import { Card, CardContent } from "./card"
import { Modal } from "./modal"
import { Checkbox } from "./checkbox"

interface Todo {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: string
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch(`${apiBase}/api/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Failed to fetch todos")
      const data = await response.json()
      setTodos(data)
      setError("")
    } catch (err) {
      console.log(err);
      setError("Failed to load todos")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError("Title cannot be empty")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const method = editingId ? "PUT" : "POST"
      const endpoint = editingId ? `/api/todos/${editingId}` : "/api/todos"
      const url = `${apiBase}${endpoint}`

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      })

      if (!response.ok) throw new Error("Failed to save todo")

      setTitle("")
      setDescription("")
      setEditingId(null)
      setIsModalOpen(false)
      setError("")
      await fetchTodos()
    } catch (err) {
      console.log(err)
      setError("Failed to save todo")
    }
  }

  const handleEditTodo = (todo: Todo) => {
    setTitle(todo.title)
    setDescription(todo.description)
    setEditingId(todo.id)
    setIsModalOpen(true)
  }

  const handleDeleteTodo = async (id: string) => {
    try {
      const token = localStorage.getItem("token")
      const url = `${apiBase}/api/todos/${id}`
      const response = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Failed to delete todo")
      setError("")
      await fetchTodos()
    } catch (err) {
      console.log(err)
      setError("Failed to delete todo")
    }
  }

  const handleToggleTodo = async (todo: Todo) => {
    try {
      const token = localStorage.getItem("token")
      const url = `${apiBase}/api/todos/${todo.id}`
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: todo.title,
          description: todo.description,
          completed: !todo.completed,
        }),
      })

      if (!response.ok) throw new Error("Failed to update todo")
      setError("")
      await fetchTodos()
    } catch (err) {
      console.log(err)
      setError("Failed to update todo")
    }
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed
    if (filter === "completed") return todo.completed
    return true
  })

  const closedTodos = todos.filter((t) => t.completed).length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-6">
            <p className="text-muted-foreground text-sm mb-1">Total Tasks</p>
            <p className="text-3xl font-bold text-foreground">{todos.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <p className="text-muted-foreground text-sm mb-1">Active</p>
            <p className="text-3xl font-bold text-foreground">{todos.length - closedTodos}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <p className="text-muted-foreground text-sm mb-1">Completed</p>
            <p className="text-3xl font-bold text-success">{closedTodos}</p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2 flex-wrap">
          {(["all", "active", "completed"] as const).map((f) => (
            <Button key={f} variant={filter === f ? "primary" : "ghost"} size="sm" onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + Add Task
        </Button>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
          </div>
        ) : filteredTodos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <svg
                className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-3 0h.01m-3 4h.01m-3 0h.01"
                />
              </svg>
              <p className="text-muted-foreground">
                {filter === "all" ? "No tasks yet. Create one to get started!" : `No ${filter} tasks.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTodos.map((todo) => (
            <Card key={todo.id} className={`transition-all duration-200 ${todo.completed ? "opacity-75" : ""}`}>
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo)}
                    className="mt-1 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold text-foreground ${
                        todo.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className="text-sm text-muted-foreground mt-1 wrap-break-word">{todo.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => handleEditTodo(todo)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteTodo(todo.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setTitle("")
          setDescription("")
          setEditingId(null)
        }}
        title={editingId ? "Edit Task" : "Add New Task"}
      >
        <form onSubmit={handleAddTodo} className="space-y-4">
          <Input placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          <textarea
            placeholder="Add notes or description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background transition-all duration-200 resize-none"
            rows={3}
          />
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false)
                setTitle("")
                setDescription("")
                setEditingId(null)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingId ? "Update" : "Create"} Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
