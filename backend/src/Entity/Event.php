<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use App\Repository\EventRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Controller\EventController;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Context\ExecutionContextInterface;
use App\Controller\EventByUserController;

#[ORM\Entity(repositoryClass: EventRepository::class)]
#[Vich\Uploadable]
#[ApiResource(
    normalizationContext: ['groups' => ['event:read']],
    denormalizationContext: ['groups' => ['event:write']],
    operations: [
        new GetCollection(
            uriTemplate: 'events/public',
            normalizationContext: ['groups' => ['event:read']],
            description: 'Récupère tous les événements publics',
            controller: EventController::class,
        ),
        // new Post(validationContext: ['groups' => ['Default', 'event:create']]),
        new Post(
            validationContext: ['groups' => ['Default', 'event:create']],
            outputFormats: ['jsonld' => ['application/ld+json']],
            inputFormats: ['multipart' => ['multipart/form-data']]
        ),
         new GetCollection(
            uriTemplate: 'events/user/{userId}',
            normalizationContext: ['groups' => ['event:read']],
            description: 'Récupère tous les événements liés à un utilisateur spécifique',
            controller: EventByUserController::class,
            read: false,
        ),

        new Get(),
        new Put(),
        new Patch(),
        new Delete(),
    ]
)]

class Event
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['event:read', 'event:write'])]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['event:read', 'event:write'])]
    private ?\DateTimeInterface $date_start = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['event:read', 'event:write'])]
    private ?\DateTimeInterface $date_end = null;

    #[ORM\Column(length: 1)]
    #[Groups(['event:read', 'event:write'])]
    #[Assert\Choice(choices: ["0", "1"], message: "La valeur doit être '0' ou '1'.")]
    private ?string $isVisible = null;

    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'events')]
    private Collection $users;

    #[Vich\UploadableField(mapping: 'events_image', fileNameProperty: 'image', size: 'imageSize')]
    #[Groups(['event:write'])]
    #[Assert\Image(
        mimeTypes: ["image/jpeg", "image/png", "image/webp"],
        mimeTypesMessage: "Format d'image invalide (JPEG, PNG, WEBP)."
    )]
    private ?File $imageFile = null;

    #[ORM\Column(length: 255, nullable: true)]
    // #[Groups(['event:read', 'event:write'])]
    private ?string $image = null;

    #[ORM\Column(nullable: true)]
    private ?int $imageSize = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;


    #[ORM\Column(length: 255, nullable: true)]
    private ?string $location = null;

    #[ORM\Column(length: 1)]
    #[Groups(['event:read', 'event:write'])]
    #[Assert\Choice(choices: ["0", "1"], message: "La valeur doit être '0' ou '1'.")]
    private ?string $is_draft = null;

    #[ORM\Column(nullable: true)]
    private ?bool $isRecommended = null;

    #[ORM\ManyToOne(inversedBy: 'event_created')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $creator = null;

    public function __construct()
    {
        $this->users = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getDateStart(): ?\DateTimeInterface
    {
        return $this->date_start;
    }

    public function setDateStart(\DateTimeInterface $date_start): static
    {
        $this->date_start = $date_start;

        return $this;
    }

    public function getDateEnd(): ?\DateTimeInterface
    {
        return $this->date_end;
    }

    public function setDateEnd(\DateTimeInterface $date_end): static
    {
        $this->date_end = $date_end;

        return $this;
    }

    #[Assert\Callback]
    public function validate(ExecutionContextInterface $context, $payload) {
        if ($this->getDateStart() && $this->getDateEnd() && $this->getDateStart() > $this->getDateEnd()) {
            $context->buildViolation('The date start must be before the date end')
                    ->atPath('date_start')
                    ->addViolation();
        }
    }

    public function isIsVisible(): ?bool
    {
        // Retourner un booléen pour la sérialisation et les appels à l'API
        return $this->isVisible === "1";
    }

    public function setIsVisible($isVisible): static
    {
        if (is_bool($isVisible)) {
            $this->isVisible = $isVisible ? "1" : "0";
        } elseif (is_string($isVisible) || is_numeric($isVisible)) {
            // Normalisation pour gérer "true", "false", "1", "0", etc.
            $this->isVisible = filter_var($isVisible, FILTER_VALIDATE_BOOLEAN) ? "1" : "0";
        } else {
            $this->isVisible = null; // Valeur par défaut si rien n'est fourni
        }
    
        return $this;
    }
    

    /**
     * @return Collection<int, User>
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): static
    {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
        }

        return $this;
    }

    public function removeUser(User $user): static
    {
        $this->users->removeElement($user);

        return $this;
    }


    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): static
    {
        $this->image = $image;

        return $this;
    }

    public function setImageFile(?File $imageFile = null): void
    {
        $this->imageFile = $imageFile;

        if (null !== $imageFile) {
            // It is required that at least one field changes if you are using doctrine
            // otherwise the event listeners won't be called and the file is lost
            $this->updatedAt = new \DateTimeImmutable();
        }
    }

    public function getImageFile(): ?File
    {
        return $this->imageFile;
    }

    public function setImageSize(?int $imageSize): void
    {
        $this->imageSize = $imageSize;
    }

    public function getImageSize(): ?int
    {
        return $this->imageSize;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(?string $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function isIsDraft(): ?bool
    {
        return $this->is_draft === "1";
    }

    public function setIsDraft($isDraft): static
    {
        if (is_bool($isDraft)) {
            $this->is_draft = $isDraft ? "1" : "0";
        } elseif (is_string($isDraft) || is_numeric($isDraft)) {
            $this->is_draft = filter_var($isDraft, FILTER_VALIDATE_BOOLEAN) ? "1" : "0";
        } else {
            $this->is_draft = null;
        }
    
        return $this;
    }

  
    public function isRecommended(): ?bool
    {
        return $this->isRecommended;
    }

    public function setIsRecommended(?bool $isRecommended): static
    {
        $this->isRecommended = $isRecommended;

        return $this;
    }

    public function __toString(){
        return $this->id.'-'.$this->title .'-'. $this->date_start->format('Y-m-d H:i:s'); 
    }

    public function getCreator(): ?User
    {
        return $this->creator;
    }

    public function setCreator(?User $creator): static
    {
        $this->creator = $creator;

        return $this;
    }


}
