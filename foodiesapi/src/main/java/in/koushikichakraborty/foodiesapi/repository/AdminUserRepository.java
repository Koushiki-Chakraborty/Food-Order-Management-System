package in.koushikichakraborty.foodiesapi.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import in.koushikichakraborty.foodiesapi.entity.AdminUser;

public interface AdminUserRepository extends MongoRepository<AdminUser, String> {

    Optional<AdminUser> findByEmail(String email);
}
