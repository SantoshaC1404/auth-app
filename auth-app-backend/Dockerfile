# ─────────────────────────────────────────────────────────────
# Stage 1: Build
# Uses the full Maven + JDK image to compile and package the app
# ─────────────────────────────────────────────────────────────
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml first and download dependencies separately.
# This layer is cached as long as pom.xml doesn't change,
# so subsequent builds skip the download step.
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the rest of the source code and build the fat JAR.
# -DskipTests skips unit tests during Docker build.
COPY src ./src
RUN mvn clean package -DskipTests -B

# ─────────────────────────────────────────────────────────────
# Stage 2: Run
# Uses a minimal JRE-only image — no Maven, no source code.
# Keeps the final image small and the attack surface low.
# ─────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS run

WORKDIR /app

# Create a non-root user to run the application.
# Running as root inside a container is a security risk.
#RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only the packaged JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Give ownership to the non-root user
#RUN chown appuser:appgroup app.jar

#USER appuser

# Spring Boot default port
EXPOSE 8082

# Start the application.
# SPRING_PROFILES_ACTIVE can be overridden via docker run -e or docker-compose.
ENTRYPOINT ["java", "-jar", "app.jar"]