# Etapa 1: Construir el Frontend (Angular)
FROM node:22 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build -- --configuration production

# Etapa 2: Construir el Backend (Spring Boot con Maven)
FROM eclipse-temurin:17-jdk-alpine AS backend-build
WORKDIR /app/backend
COPY backend/.mvn/ .mvn
COPY backend/mvnw backend/pom.xml ./
RUN ./mvnw dependency:go-offline
COPY backend/src ./src
# Copiar los archivos estáticos de Angular compilados al directorio de recursos del backend
COPY --from=frontend-build /app/frontend/dist/*/browser /app/backend/src/main/resources/static
RUN ./mvnw clean package -DskipTests

# Etapa 3: Imagen final ligera para ejecución
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]