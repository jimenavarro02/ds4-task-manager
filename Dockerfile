# ===== Etapa 1: compilar el frontend Angular =====
FROM node:22-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npx ng build --configuration production

# ===== Etapa 2: compilar el backend Spring Boot (con el frontend dentro) =====
FROM maven:3.9-eclipse-temurin-17 AS backend
WORKDIR /app/backend
COPY backend/pom.xml ./
RUN mvn -B -q dependency:go-offline
COPY backend/src ./src
# Spring Boot sirve todo lo que esté en resources/static
COPY --from=frontend /app/frontend/dist/frontend/browser ./src/main/resources/static
# Las pruebas ya se ejecutan en el workflow de CI
RUN mvn -B -DskipTests package

# ===== Etapa 3: imagen final liviana =====
FROM eclipse-temurin:17-jre
WORKDIR /app
RUN useradd --system --create-home appuser
COPY --from=backend /app/backend/target/*.jar app.jar
USER appuser
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75"
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
