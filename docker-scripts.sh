#!/bin/bash

# Script para facilitar o uso do Docker com Expense Tracker App

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Expense Tracker App - Docker${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Função para mostrar ajuda
show_help() {
    print_header
    echo ""
    echo "Comandos disponíveis:"
    echo ""
    echo "  dev          - Iniciar ambiente de desenvolvimento"
    echo "  prod         - Iniciar ambiente de produção"
    echo "  preview      - Iniciar preview de produção"
    echo "  build        - Fazer build da imagem"
    echo "  clean        - Limpar containers e imagens"
    echo "  logs         - Mostrar logs do container"
    echo "  shell        - Acessar shell do container"
    echo "  help         - Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  ./docker-scripts.sh dev"
    echo "  ./docker-scripts.sh prod"
    echo "  ./docker-scripts.sh preview"
    echo ""
}

# Função para desenvolvimento
start_dev() {
    print_message "Iniciando ambiente de desenvolvimento..."
    docker-compose --profile dev up --build
}

# Função para produção
start_prod() {
    print_message "Iniciando ambiente de produção..."
    docker-compose --profile prod up --build -d
    print_message "Aplicação disponível em: http://localhost"
}

# Função para preview
start_preview() {
    print_message "Iniciando preview de produção..."
    docker-compose --profile preview up --build -d
    print_message "Preview disponível em: http://localhost:3000"
}

# Função para build
build_image() {
    print_message "Fazendo build da imagem..."
    docker build -t expense-tracker-app .
    print_message "Build concluído!"
}

# Função para limpar
clean_docker() {
    print_warning "Limpando containers e imagens..."
    docker-compose down --rmi all --volumes --remove-orphans
    docker system prune -f
    print_message "Limpeza concluída!"
}

# Função para logs
show_logs() {
    print_message "Mostrando logs..."
    docker-compose logs -f
}

# Função para shell
access_shell() {
    print_message "Acessando shell do container..."
    docker-compose exec expense-tracker-dev sh
}

# Verificar se Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker não está instalado!"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose não está instalado!"
        exit 1
    fi
}

# Função principal
main() {
    check_docker
    
    case "${1:-help}" in
        "dev")
            start_dev
            ;;
        "prod")
            start_prod
            ;;
        "preview")
            start_preview
            ;;
        "build")
            build_image
            ;;
        "clean")
            clean_docker
            ;;
        "logs")
            show_logs
            ;;
        "shell")
            access_shell
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Executar função principal
main "$@"
